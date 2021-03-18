const crypto = require('crypto');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Token = require('../models/Token');

exports.sendVerificationEmail = async (user) => {
  const { _id, name, email } = user;

  const token = new Token({ user: _id, token: crypto.randomBytes(16).toString('hex') });
  await token.save();

  await sgMail.send({
    to: email,
    from: 'noreply@scrumsleek.com',
    subject: 'Activate your ScrumSleek account',
    text: `Welcome to ScrumSleek, ${name}!. Please verify your email to activate your account.`,
    html: `
        <center>
          <h1>Welcome to ScrumSleek, ${name}!</h1>
          <h2>Please use the following link to activate your account</h2>
          <a href='${process.env.CLIENT_URL}/auth/verify/${token.token}' style='font-size: 1.5rem'>
            Verify Email Address
          </a>
        </center>
      `,
  });
};

exports.sendPasswordReset = async (user) => {
  const { _id, name, email } = user;

  const token = new Token({ user: _id, token: crypto.randomBytes(16).toString('hex') });
  await token.save();

  await sgMail.send({
    to: email,
    from: 'noreply@scrumsleek.com',
    subject: 'Reset your ScrumSleek account password',
    text: `You have just made a request to reset your password, ${name}.`,
    html: `
        <center>
          <h1>Reset your ScrumSleek password</h1>
          <h2>Please use the following link to reset your password, ${name}</h2>
          <a href='${process.env.CLIENT_URL}/auth/resetPassword/${token.token}' style='font-size: 1.5rem'>
            Reset Password
          </a>
        </center>
      `,
  });
};
