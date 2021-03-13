const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const admin = require('../middleware/admin');

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

    // Add user to project's members with 'Developer' role
    project.members.push({ user: user.id, role: 'Developer' });
    await project.save();

    const { name, avatar } = user;
    const payload = { user: { _id: user.id, name, avatar }, role: 'Developer' };
    req.app.get('io').to(project.id).emit('ADD_MEMBER', payload);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Change a member's role
router.patch('/role/:id', [auth, member], async (req, res) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.header('projectId')).populate(
      'members.user',
      'name avatar'
    );

    // Enforce only one each of admin, product owner, and scrum master
    if (role !== 'Developer') {
      const existing = project.members.find((member) => member.role === role);
      if (existing) existing.role = 'Developer';
    }

    const memberId = req.params.id;
    const member = project.members.find((member) => member.user._id == memberId);
    member.role = role;
    await project.save();

    req.app.get('io').to(project.id).emit('CHANGE_ROLE', project.members);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Leave a project / remove a member
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

    // Delete user from project's members
    project.members.splice(
      project.members.findIndex((member) => member.user == user.id),
      1
    );

    // Delete user from all involved tasks
    for (const task of project.tasks) {
      if (task.members.map((member) => member.user).includes(user.id)) {
        task.members.splice(
          task.members.findIndex((member) => member.user == user.id),
          1
        );
      }
    }
    await project.save();

    const io = req.app.get('io');

    const clients = io.sockets.adapter.rooms.get(project.id);
    for (const clientId of clients) {
      const client = io.sockets.sockets.get(clientId);
      if (client.userId == user.id) io.to(clientId).emit('LEAVE_PROJECT', project.id);
    }

    const payload = { tasks: project.tasks, memberId: user.id };
    io.to(project.id).emit('REMOVE_MEMBER', payload);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
