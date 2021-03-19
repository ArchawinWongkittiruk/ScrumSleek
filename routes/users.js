const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const auth = require('../middleware/auth');
const { sendVerificationEmail, sendPasswordReset } = require('../utils/emailing');
const leaveProject = require('../utils/leaveProject');
const deleteProject = require('../utils/deleteProject');

const User = require('../models/User');
const Token = require('../models/Token');
const Project = require('../models/Project');

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

      await sendVerificationEmail(user);

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

    await sendVerificationEmail(user);

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

// Get user with email
router.get('/:input', async (req, res) => {
  try {
    res.json(await User.findOne({ email: req.params.input }).select('-password'));
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

// Delete user and leave/delete projects
router.delete('/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (req.user.id !== userId) {
      return res.status(401).json({ msg: 'You cannot delete other users' });
    }

    for (const projectId of user.projects) {
      const project = await Project.findById(projectId);
      if (project.members.some((member) => member.role === 'Admin' && member.user == user.id)) {
        await deleteProject(req, res, project);
      } else {
        await leaveProject(req, res, project);
      }
    }
    await user.remove();

    res.json({ msg: 'Your account has been deleted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
