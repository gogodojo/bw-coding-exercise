
const express = require('express');
const morganLogger = require('morgan');
const bodyParser = require('body-parser');

const { validateEmailRequest, convertHtmlToPlaintext } = require("./util");

module.exports = class EmailController {

  constructor(emailService) {
    this.emailService = emailService;
    this.PORT = process.env.BW_SENDMAIL_PORT || 3000;
  }

  start() {
    this.app = express();

    // set up global middleware function pipeline
    this.app.use(morganLogger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(validateEmailRequest);

    // POST endpoint for client send email request
    // - responds with status 200 if email was sent by any service
    // - responds with status 500 and generic error message if email was not sent
    this.app.post('/email', (req, res, next) => {
      const emailRequest = req.body;
      const plaintextBody = convertHtmlToPlaintext(emailRequest.body);

      // TODO: If a given service is unable to send email, add auto-failover
      //       to the other/next service and retry; if all services exhausted
      //       in a continuous sequence for a request, then report failure to user.
      this.emailService.sendEmail({...emailRequest, body: plaintextBody},
          (wasSuccessful, message) => {
            if (wasSuccessful) {
              res.status(200);
              res.send("OK");
            } else {
              res.status(500);
              res.send({message: "Cannot process your request at this time.  Please try again later."});
            }
          });
    });

    this.listener = this.app.listen(this.PORT, () => {
      console.log(`Brightwheel email proxy server listening on port ${ this.PORT }`);
    });
  }
}
