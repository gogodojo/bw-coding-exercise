const request = require("request");

module.exports = class GenericEmailService {
  constructor() {}

  // build the request options for send mail endpoint
  // NOTE: this method must be overridden by subclasses
  getRequestOptions(emailRequest) {
    throw new Error("getRequestOptions() cannot be used in parent class; must override in subclasses");
  }

  // conduct the request to the email service and callback status
  // - callback signature: fn(wasSuccessful, message)
  sendEmail(emailRequest, callback) {
    const requestOptions = this.getRequestOptions(emailRequest);

    request(requestOptions, (err, res, body) => {
      if (err) {
        console.error('request error:', err);
        callback(false, err);
        return;
      }
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.info('request success:', res.statusCode);
        callback(true, "OK");
        return;
      } else {
        console.error('request failed:', res.statusCode, body);
        callback(false, body);
        return;
      }
    });
  }
}
