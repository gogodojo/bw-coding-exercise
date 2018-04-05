////////////////////////////////////////////////////////////////////////////////
// utilities
////////////////////////////////////////////////////////////////////////////////

// convert an HTML document to plaintext
// - strip all open tags
// - replace all end tags with newlines
// - replace all resulting duplicate newlines with single newlines
// TODO: consider replacing this with something like stripTags package
// https://www.npmjs.com/package/striptags
const convertHtmlToPlaintext = (doc) => {
  const re_openTags = /<[^>]+>/g;
  const re_endTags = /<(?:.|\n)*?>/gm;
  const re_duplicateNewlines = /(\n){2,}/g;

  doc = doc.replace(re_endTags, '\n');
  doc = doc.replace(re_openTags, '');
  doc = doc.replace(re_duplicateNewlines, '\n');

  return doc;
}

// validates an email address as: {something}@{something}.{something}
// TODO: consider using a package, and/or verify back-end services handle this
const isValidEmailAddress = (emailAddress) => {
  const re = /.+@.+\..+/i;
  return re.test(emailAddress);
}

// an express middleware function to validate the email request
const validateEmailRequest = (req, res, next) => {
  // deconstruct each expected value from the json-parsed body
  const {to, to_name, from, from_name, subject, body} = req.body;

  // reconstruct email request with ONLY the required key-values
  const emailRequest = {to, to_name, from, from_name, subject, body};

  // verify each key value is non-empty
  Object.entries(emailRequest).forEach(([key, value]) => {
    if (!value) {
      next(new Error(`missing field "${ key }"`));
      return;
    }
  });

  if (!isValidEmailAddress(emailRequest.to)) {
    next(new Error(`invalid 'to' email address`));
    return;
  }

  if (!isValidEmailAddress(emailRequest.from)) {
    next(new Error(`invalid 'from' email address`));
    return;
  }

  // all good!
  next();
}

module.exports = {
  isValidEmailAddress,
  validateEmailRequest,
  convertHtmlToPlaintext
};
