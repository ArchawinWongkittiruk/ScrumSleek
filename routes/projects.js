const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const admin = require('../middleware/admin');
const { check, validationResult } = require('express-validator');
const deleteProject = require('../utils/deleteProject');

const User = require('../models/User');
const Project = require('../models/Project');

// Add a project
router.post(
  '/',
  [auth, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title } = req.body;

      // Create and save the project
      const newProject = new Project({ title });
      const project = await newProject.save();

      // Add project to user's projects
      const user = await User.findById(req.user.id);
      user.projects.unshift(project.id);
      await user.save();

      // Add user to project's members as admin
      project.members.push({ user: user.id });
      await project.save();

      res.json({ _id: project.id, title, updatedAt: project.updatedAt });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get user's projects
router.get('/', auth, async (req, res) => {
  try {
    res.json((await User.findById(req.user.id).populate('projects', 'title updatedAt')).projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a project by id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members.user', 'name avatar');
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Change a project's title
router.patch(
  '/rename/:id',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      project.title = req.body.title;
      await project.save();

      const payload = { _id: project.id, title: project.title };
      req.app.get('io').to(project.id).emit('RENAME_PROJECT', payload);
      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Delete a project
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    await deleteProject(req, res, await Project.findById(req.params.id));
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
