# ScrumSleek

Final-year project by Archawin Wongkittiruk @ King's College London.

A project management tool for introducing the Scrum agile framework to students new to software development.

## Development Setup

You will need Node JS, a browser, and a terminal to run this application.

### Add a .env file at the root specifying your own variables

MONGO_URI - This application uses MongoDB Atlas to host the database in the cloud. You can also use a local database during development. See https://www.mongodb.com/.

JWT_SECRET - Any random string will do.

CLIENT_URL - For local development, use 'http://localhost:3000'.

SENDGRID_API_KEY - See https://sendgrid.com/.

EMAIL_FROM - The email address from which you will be sending verification and password reset emails. See SendGrid as before.

### (Optional) Skip emailing setup

Email verification and password resetting are good features to have in any app that involves user authentication, and they are implemented in this app. However, those things are not this app's key focus.

This being the case, the process of quickly setting up the application for development can be significantly sped up by skipping the emailing setup, forgoing those features. The last three .env variables can also then be ignored. Here's how:

1. In routes\users.js, remove from the "Register user" controller the "await sendVerificationEmail(user)" line (line 57).

2. In client\src\pages\Projects.js, remove the if-statement checking for user verification (lines 18-20).

3. In client\src\pages\Login.js, remove the "Forgot Your Password?" section (lines 89-98).

4. In client\src\pages\Account.js, remove the "Send Password Reset" section (lines 90-98).

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run the server and client at the same time from the root

```bash
npm run dev
```

## Credits

Much of the authentication-related code has been reused from https://github.com/ArchawinWongkittiruk/TrelloClone. By extension, the code is from a course on Udemy I learned the MERN stack from, the source code for which can be found at https://github.com/bradtraversy/devconnector_2.0. The quick start for this README was also inspired by that repository's quick start.
