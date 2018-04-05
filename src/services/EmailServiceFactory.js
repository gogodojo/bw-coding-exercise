const MailgunEmailService = require('./MailgunEmailService');
const SendgridEmailService = require('./SendgridEmailService');


const EmailServiceFactory = {
  get: (mailer) => {
    switch(mailer) {
      case 'mailgun':
        return new MailgunEmailService();
      case 'sendgrid':
        return new SendgridEmailService();
      default:
        throw new Error(`invalid mailer requested: ${ mailer }`);
    }
  }
}

module.exports = EmailServiceFactory;
