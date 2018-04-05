////////////////////////////////////////////////////////////////////////////////
// ENTRY POINT
////////////////////////////////////////////////////////////////////////////////

require("dotenv-safe").config();

const EmailServiceFactory = require('./services/EmailServiceFactory');
const EmailController = require('./EmailController');

// get an injectable email service
const emailService = EmailServiceFactory.get(process.env.BW_MAILER);

// construct and start the controller
const emailController = new EmailController(emailService);
emailController.start();
