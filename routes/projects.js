const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const { check, validationResult } = require('express-validator');

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
      project.members.push({ user: user.id, name: user.name });
      await project.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get user's projects
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const projects = [];
    for (const projectId of user.projects) {
      projects.push(await Project.findById(projectId));
    }

    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a project by id
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
