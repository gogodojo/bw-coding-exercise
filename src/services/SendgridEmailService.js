const GenericEmailService = require("./GenericEmailService");

// specialization for SendGrid email services
module.exports = class SendgridEmailService extends GenericEmailService {
  constructor() {
    super();
    this.apiKey = process.env.SENDGRID_API_KEY;
    this.url = process.env.SENDGRID_URL;
  }

  // build the request options for send mail endpoint
  // - overrides base class method
  getRequestOptions(emailRequest) {
    return {
      method: 'POST',
      json: true,
      url: this.url + '/mail/send',
      auth: {
        bearer: this.apiKey
      },
      body: {
        from: {
          email: emailRequest.from,
          name: emailRequest.from_name
        },
        personalizations: [{
          to: [{
            email: emailRequest.to,
            name: emailRequest.to_name
          }]
        }],
        subject: emailRequest.subject,
        content: [{
          type: 'text/plain',
          value: emailRequest.body
        }]
      }
    };
  }
}
