const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');

// Start a sprint
router.post('/', [auth, member], async (req, res) => {
  try {
    const projectId = req.header('projectId');

    // Create and save the sprint
    const project = await Project.findById(projectId);
    project.sprint = req.body;
    project.sprint.ongoing = true;

    for (let task of project.tasks) {
      if (task.location === 'SPRINTPLAN') {
        task.location = 'SPRINT';
      }
    }

    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// End a sprint
router.post('/end', [auth, member], async (req, res) => {
  try {
    const projectId = req.header('projectId');

    const project = await Project.findById(projectId);
    project.sprint.ongoing = false;

    for (let task of project.tasks) {
      if (task.location === 'SPRINT') {
        task.location = 'BACKLOG';
      }
    }

    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
