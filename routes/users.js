const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const auth = require('../middleware/auth');

const User = require('../models/User');
const Token = require('../models/Token');

async function sendConfirmationEmail(user) {
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
}

// Register user
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user && user.verified) {
        // User already exists and is verified
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      } else if (!user) {
        // Register new user
        user = new User({
          name,
          email,
          password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
        });
        await user.save();
      } else {
        // Change name/password for existing but unverified user
        user.name = name;
        user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
        await user.save();
      }

      await sendConfirmationEmail(user);

      // Return jsonwebtoken
      jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, msg: `A verification email has been sent to ${user.email}.` });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Resend verification token
router.post('/resendVerify', auth, async (req, res) => {
  try {
    const user = req.body;

    await sendConfirmationEmail(user);

    res.json({ msg: `A verification email has been sent to ${user.email}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify user
router.post('/verify/:token', async (req, res) => {
  try {
    let user;
    let token = await Token.findOne({ token: req.params.token });
    if (token) {
      user = await User.findById(token.user);
      user.verified = true;
      await user.save();
    } else {
      return res.status(400).json({ errors: [{ msg: 'Invalid/expired verification token' }] });
    }

    // Return jsonwebtoken
    jwt.sign(
      {
        user: {
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: 'Verification successful. Welcome to ScrumSleek!' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get users with email regex
router.get('/:input', auth, async (req, res) => {
  try {
    const regex = new RegExp(req.params.input, 'i');
    const users = await User.find({
      email: regex,
    }).select('-password');

    res.json(users.filter((user) => user.id !== req.user.id));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Edit user's name and/or avatar
router.put(
  '/:userId',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, avatar } = req.body;

    try {
      const userId = req.params.userId;
      if (req.user.id !== userId) {
        return res.status(401).json({ msg: 'You cannot edit the details of other users' });
      }

      const user = await User.findById(userId);
      user.name = name;
      user.avatar = avatar;
      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

async function sendPasswordReset(user) {
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
}

// Send password reset
router.post('/sendResetPassword/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // See if user exists
    let user = await User.findOne({ email });
    if (user) {
      await sendPasswordReset(user);
    } else {
      return res.status(400).json({
        errors: [{ msg: 'User does not exist' }],
      });
    }

    res.json({ msg: `A password reset request has been sent to ${email}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reset password
router.post(
  '/resetPassword/:token',
  [
    check('password', 'Please enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    try {
      let user;
      let token = await Token.findOne({ token: req.params.token });
      if (token) {
        user = await User.findById(token.user);
        user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
        await user.save();
      } else {
        return res.status(400).json({ errors: [{ msg: 'Invalid/expired password reset token' }] });
      }

      res.json({ msg: `Password has been reset for ${user.email}.` });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
