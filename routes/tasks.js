const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');

// Add a task
router.post(
  '/',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, label, location } = req.body;
      const projectId = req.header('projectId');

      // Create and save the task
      const project = await Project.findById(projectId);
      let task = { title, label, location };
      task.status = project.statuses[0].id;
      project.tasks.push(task);
      await project.save();

      task = project.tasks[project.tasks.length - 1];
      req.app.get('io').to(project.id).emit('ADD_TASK', task);
      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Edit a task's title and/or label
router.patch(
  '/edit/:id',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, label } = req.body;
      const project = await Project.findById(req.header('projectId'));

      const taskId = req.params.id;
      const task = project.tasks.find((task) => task.id === taskId);
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      task.title = title;
      task.label = label;
      await project.save();

      req.app.get('io').to(project.id).emit('EDIT_TASK', task);
      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Move a task (for both locations and indexes)
router.patch('/move/:id', [auth, member], async (req, res) => {
  try {
    const { to, oldIndex, newIndex } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const taskId = req.params.id;
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Changing index
    if (oldIndex !== null && newIndex !== null && oldIndex !== newIndex) {
      project.tasks.splice(oldIndex, 1);
      project.tasks.splice(newIndex, 0, task);
    }

    // Changing location
    if (to) task.location = to;

    await project.save();

    req.app.get('io').to(project.id).emit('MOVE_TASK', project.tasks);
    res.end();
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

    req.app.get('io').to(project.id).emit('CHANGE_TASK_STATUS', task);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Change a task's story points estimate
router.patch('/storyPoints/:id', [auth, member], async (req, res) => {
  try {
    const { storyPoints } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const taskId = req.params.id;
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Set to 0 if input if empty
    task.storyPoints = storyPoints ? storyPoints : 0;
    await project.save();

    req.app.get('io').to(project.id).emit('CHANGE_TASK_STORY_POINTS', task);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add/Remove a member
router.put('/setMember/:add/:taskId/:userId', [auth, member], async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const project = await Project.findById(req.header('projectId'));
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // If not adding then removing
    const add = req.params.add === 'true';
    const members = task.members.map((member) => member.user);
    const index = members.indexOf(userId);
    if ((add && members.includes(userId)) || (!add && index === -1)) {
      return res.json(task);
    }

    if (add) {
      task.members.push({ user: userId });
    } else {
      task.members.splice(index, 1);
    }
    await project.save();

    req.app.get('io').to(project.id).emit('SET_TASK_MEMBER', task);
    res.end();
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
      project.tasks.findIndex((task) => task.id === taskId),
      1
    );
    await project.save();

    req.app.get('io').to(project.id).emit('DELETE_TASK', taskId);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
