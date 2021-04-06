const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');

const Project = require('../models/Project');

// Start a sprint
router.post('/', [auth, member], async (req, res) => {
  try {
    const { start, end, target } = req.body;
    const projectId = req.header('projectId');

    // Create and save the sprint
    const project = await Project.findById(projectId);
    project.sprints.unshift({ start, end, target });
    project.sprintOngoing = true;

    // Move all tasks from sprint plan to sprint
    for (let task of project.tasks) {
      if (task.location === 'SPRINTPLAN') {
        task.location = 'SPRINT';
      }
    }

    await project.save();

    const payload = { tasks: project.tasks, sprints: project.sprints, sprintOngoing: true };
    req.app.get('io').to(project.id).emit('START_SPRINT', payload);
    res.end();
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
    project.sprintOngoing = false;

    // Set the sprint end to the current date and time
    const sprint = project.sprints[0];
    sprint.end = new Date();

    // Move unfinished tasks back to the backlog, and to the completed sprint otherwise
    for (const task of project.tasks) {
      if (
        task.status == project.statuses[project.statuses.length - 1].id &&
        !task.sprintCompleted
      ) {
        task.location = 'COMPLETED';
        task.sprintCompleted = sprint.id;
      } else if (task.location === 'SPRINT') {
        task.location = 'BACKLOG';
      }
    }

    await project.save();

    const payload = { tasks: project.tasks, sprints: project.sprints, sprintOngoing: false };
    req.app.get('io').to(project.id).emit('END_SPRINT', payload);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Edit a sprint's review and/or retrospective
router.put('/reviewRetrospective/:id', [auth, member], async (req, res) => {
  try {
    const { review, retrospective } = req.body;
    const project = await Project.findById(req.header('projectId'));

    const sprintId = req.params.id;
    const sprint = project.sprints.find((sprint) => sprint.id === sprintId);

    sprint.review = review;
    sprint.retrospective = retrospective;
    await project.save();

    req.app.get('io').to(project.id).emit('EDIT_REVIEW_RETROSPECTIVE', sprint);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Set enforcement of velocity limit
router.put('/velocityLimited', [auth, member], async (req, res) => {
  try {
    const { limited } = req.body;
    const project = await Project.findById(req.header('projectId'));

    project.velocityLimited = limited;
    await project.save();

    req.app.get('io').to(project.id).emit('SET_VELOCITY_LIMITED', project.velocityLimited);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Set velocity limit
router.put('/velocityLimit', [auth, member], async (req, res) => {
  try {
    const { limit } = req.body;
    const project = await Project.findById(req.header('projectId'));

    project.velocityLimit = limit ? limit : 0;
    await project.save();

    req.app.get('io').to(project.id).emit('SET_VELOCITY_LIMIT', project.velocityLimit);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
