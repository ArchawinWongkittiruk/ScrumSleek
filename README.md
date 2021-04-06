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

Most of the authentication-related code has been reused from https://github.com/ArchawinWongkittiruk/TrelloClone. By extension, the code is from a course on Udemy I learned the MERN stack from, the source code for which can be found at https://github.com/bradtraversy/devconnector_2.0. The quick start for this README was also inspired by that repository's quick start.
