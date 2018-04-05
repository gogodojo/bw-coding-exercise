const GenericEmailService = require("./GenericEmailService");

// specialization for MailGun email services
module.exports = class MailgunEmailService extends GenericEmailService {
  constructor() {
    super();
    this.apiKey = process.env.MAILGUN_API_KEY;
    this.url = process.env.MAILGUN_URL;
    this.domain = process.env.MAILGUN_DOMAIN;
  }

  // build the request options for send mail endpoint
  // - overrides base class method
  getRequestOptions(emailRequest) {
    return {
      method: 'POST',
      uri: this.url + "/" + this.domain + "/messages",
      form: {
        to: `${emailRequest.to_name} <${emailRequest.to}>`,
        from: `${emailRequest.from_name} <${emailRequest.from}>`,
        subject: emailRequest.subject,
        text: emailRequest.body
      },
      auth: {
        user: 'api',
        pass: this.apiKey
      }
    };
  }
}
