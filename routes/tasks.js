const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');

// Add a task to backlog
router.post(
  '/',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const title = req.body.title;
      const projectId = req.header('projectId');

      // Create and save the task
      const project = await Project.findById(projectId);
      const task = { title };
      project.tasks.push(task);
      await project.save();

      res.json(project.tasks[project.tasks.length - 1]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Edit a task
router.patch(
  '/edit/:id',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title } = req.body;
      const project = await Project.findById(req.header('projectId'));

      const taskId = req.params.id;
      const task = project.tasks.find((task) => task.id === taskId);
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      task.title = title;
      await project.save();

      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
