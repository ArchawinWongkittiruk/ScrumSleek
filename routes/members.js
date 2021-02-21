const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const admin = require('../middleware/admin');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Project = require('../models/Project');

// Add a project member
router.put('/addMember/:userId', [auth, admin], async (req, res) => {
  try {
    const project = await Project.findById(req.header('projectId'));
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // See if already member of project
    if (project.members.map((member) => member.user).includes(req.params.userId)) {
      return res.status(400).json({ msg: 'Already member of project' });
    }

    // Add project to user's projects
    user.projects.unshift(project.id);
    await user.save();

    // Add user to project's members with 'normal' role
    project.members.push({ user: user.id, name: user.name, role: 'Developer' });

    await project.save();

    res.json(project.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Leave a project
router.delete('/leave/:userId', [auth, member], async (req, res) => {
  try {
    const project = await Project.findById(req.header('projectId'));
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete project from user's projects
    user.projects.splice(user.projects.indexOf(project.id), 1);
    await user.save();

    // Delete user from project's members and from all involved tasks
    project.members.splice(project.members.findIndex((member) => member.user == user.id));
    for (const task of project.tasks) {
      if (task.members.map((member) => member.user).includes(user.id)) {
        task.members.splice(task.members.findIndex((member) => member.user == user.id));
      }
    }
    await project.save();

    res.json(project.id);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
