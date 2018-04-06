# Brightwheel Full Stack Exercise

Goal:
"In order to prevent downtime during an email service provider outage, you’re tasked with creating a service that provides an abstraction between two different email service providers. This way, if one of the services goes down, you can quickly failover to a different provider without affecting your customers."

## Getting Started

### Sign Up
This software ultimately integrates with external providers (MailGun and SendGrid) which require authenticated access to their services.  To proceed, it is necessary to establish user accounts (and API keys) with these providers. Both offer sandboxed free options for experimentation or testing.  You'll need the API keys, sandbox domain names, and other details for each to configure this software.

### Install
* Install node.js if not already installed.
    * Verify: ```node --version```
* Clone this repo to your local workstation, open a terminal, and switch to that directory.
* Install dependencies: ```npm install```.

### Configure
It is expected that you provide your own credentials to use/test this application.

* All runtime configuration is specified through either/both:
    * host process environment variables (as in a shell, Heroku, AWS, etc)
    * a ```.env``` file (see model ```.env.example``` file)
* Copy ```.env.example``` to ```.env``` and edit:
    * Specify which service to use (BW_MAILER).
    * Fill in the required mailgun and sendmail details (API keys, domain names, etc.).

### Start/Run Web Server Application
* Run server (locally): ```npm start``` (by default it will run on port 3000)
  * Expect: output should show "Brightwheel is listening on port..."

### Verify
* In Postman, CURL, or a similar facility:
    * Submit a POST request to ```localhost:3000/email``` with a valid JSON request
        * Expect: a 200-300 response code with "OK" message
        * Expect: to receive an email at the "to" address with the content, subject, and "from" values specified
            * NOTE: the email may be tagged as "spam" by your email service provider, so please check *all* your email folders
        * Expect: an error if any required field was missing, empty, or if the service is down or rejects your credentials
* For example, to send the sample in file ```./sample_email_request.json```:```
curl -X POST -H "Content-Type: application/json" --data "@sample_email_request.json" http://localhost:3000/email
```

### Switching Services
To switch from one back-end email service provider to the other:
* Kill/stop/interrupt any running server.
* Modify the environment variable "BW_MAILER" (or in the .env file) to use to the new provider ("sendgrid" or "mailgun").
* Restart/redeploy and verify the server as above.

### Web Service Overview

* The web service listens on port 3000, unless overridden by a BW_SENDMAIL_PORT environment variable.
* The only serviced endpoint is ```/email```, which expects a POST of a JSON-formatted email request (per the requirements).
    * Each of the request fields are verified to exist and be non-empty.
    * The request ```to``` and ```from``` email address values are (roughly) validated:
        * Must resemble ```{something}@{something}.(something)```.
    * The request ```body``` value is naively pre-processed from HTML document format into "plain text" format:
        * HTML tags are removed or replaced with newlines.
    * The validated and formatted request is then shunted to one of the back-end email services, specified by environment variable ```BW_MAILER``` ('mailgun' or 'sendgrid').
    * After the back-end service responds, the web service responds to the client with:
        * Status 200 and body message "OK" if the email submission was successfully sent (per the back-end providers)
        * Status 500 and body message "Unable to process your request..." if unsuccessful for any reason.

### Design & Implementation Considerations
* This exercise was well-suited to a Node.js implementation as
there are no CPU-intensive blocking operations, the back-end services are
asynchronous, the server is ultimately scalable, and the language and
frameworks are ubiquitous.
* The email validation routine is very naive and biased towards delegating
email validation to the email service providers (who, ultimately, are probably more likely
to statically validate emails much more thoroughly than the caller).
* Converting an HTML document (email message) to "plain text" is actually a very deep and indefinite problem.  
Converting every possible embedded span, line break, empty element, and so on could potentially
involve an extensive/massive transformational rule set.  I've employed a very rudimentary
solution, but there are likely very much improved solutions in the open-source community.
* This service *should* automatically failover to alternative service providers automatically
and *try* to service the end-user's request.  Implementing this would involve (potentially) traversing a
directed graph of failover services until the request was ultimately satisfied or all alternatives were exhausted.

### Unmentionables
* Static types (TypeScript, Flow, etc.)
* Complete unit tests
* Complete integration tests
* Prod-ready exception handling
* Prod-ready logging and dashboards
* Code reviews
