const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');

// Add a status
router.post(
  '/',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, color } = req.body;
      const projectId = req.header('projectId');

      // Create and save the status
      const project = await Project.findById(projectId);
      const status = { title, color };
      project.statuses.splice(project.statuses.length - 1, 0, status);
      await project.save();

      await req.app.get('io').to(project.id).emit('ADD_STATUS', project.statuses);
      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Edit a status's title
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

      const statusId = req.params.id;
      const status = project.statuses.find((status) => status.id === statusId);
      if (!status) {
        return res.status(404).json({ msg: 'Status not found' });
      }

      status.title = title;
      await project.save();

      await req.app.get('io').to(project.id).emit('EDIT_STATUS', status);
      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Move a status
router.patch('/move/:id', [auth, member], async (req, res) => {
  try {
    const { oldIndex, newIndex } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const statusId = req.params.id;
    const status = project.statuses.find((status) => status.id === statusId);
    if (!status) {
      return res.status(404).json({ msg: 'Status not found' });
    }

    if (oldIndex !== null && newIndex !== null && oldIndex !== newIndex) {
      project.statuses.splice(oldIndex, 1);
      project.statuses.splice(newIndex, 0, status);
    }
    await project.save();

    await req.app.get('io').to(project.id).emit('MOVE_STATUS', project.statuses);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Change a status's color
router.patch('/color/:id', [auth, member], async (req, res) => {
  try {
    const { color } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const statusId = req.params.id;
    const status = project.statuses.find((status) => status.id === statusId);
    if (!status) {
      return res.status(404).json({ msg: 'Status not found' });
    }

    status.color = color;
    await project.save();

    await req.app.get('io').to(project.id).emit('CHANGE_STATUS_COLOR', status);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a status
router.delete('/:id', [auth, member], async (req, res) => {
  try {
    const statusId = req.params.id;
    const project = await Project.findById(req.header('projectId'));

    const statusIndex = project.statuses.findIndex((status) => status.id === statusId);
    project.statuses.splice(statusIndex, 1);

    const replacementIndex = statusIndex > 0 ? statusIndex - 1 : 0;
    for (const task of project.tasks) {
      if (task.status == statusId) {
        task.status = project.statuses[replacementIndex].id;
      }
    }
    await project.save();

    const payload = { statuses: project.statuses, tasks: project.tasks };
    await req.app.get('io').to(project.id).emit('DELETE_STATUS', payload);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
