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
      task.status = project.statuses[0].id;
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

// Move a task
router.patch('/move/:id', [auth, member], async (req, res) => {
  try {
    // const { to, toIndex } = req.body;
    const { to } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const taskId = req.params.id;
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // if (toIndex === 0 || toIndex) {
    //   project.tasks.splice(toIndex, 0, task);
    // } else {
    //   project.tasks.push(task);
    // }

    // const fromIndex = project.tasks.indexOf(task);
    // if (fromIndex !== -1) {
    //   project.tasks.splice(fromIndex, 1);
    // }

    task.location = to;
    await project.save();

    res.send(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Change a task's status
router.patch('/status/:id', [auth, member], async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const taskId = req.params.id;
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.status = status;
    await project.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add/Remove a member
router.put('/addMember/:add/:taskId/:userId', [auth, member], async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const project = await Project.findById(req.header('projectId'));
    const user = project.members.find((member) => member.user == userId);
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task || !user) {
      return res.status(404).json({ msg: 'Task/user not found' });
    }

    const add = req.params.add === 'true';
    const members = task.members.map((member) => member.user);
    const index = members.indexOf(userId);
    if ((add && members.includes(userId)) || (!add && index === -1)) {
      return res.json(task);
    }

    if (add) {
      task.members.push({ user: user.user, name: user.name });
    } else {
      task.members.splice(index, 1);
    }
    await project.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task
router.delete('/:id', [auth, member], async (req, res) => {
  try {
    const taskId = req.params.id;
    const project = await Project.findById(req.header('projectId'));

    project.tasks.splice(
      project.tasks.findIndex((task) => task._id === taskId),
      1
    );
    await project.save();

    res.json(taskId);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
