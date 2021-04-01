const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const member = require('../middleware/member');
const admin = require('../middleware/admin');
const leaveProject = require('../utils/leaveProject');

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

    const io = req.app.get('io');

    // Emit project to new member
    const clients = Array.from(await io.allSockets());
    let payload = { _id: project.id, title: project.title, updatedAt: project.updatedAt };
    for (const clientId of clients) {
      const client = io.sockets.sockets.get(clientId);
      if (client.userId == user.id) io.to(clientId).emit('ADD_PROJECT', payload);
    }

    const { _id, name, avatar } = user;
    payload = { user: { _id, name, avatar }, role: 'Developer' };
    io.to(project.id).emit('ADD_MEMBER', payload);
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
    await leaveProject(req, res, await Project.findById(req.header('projectId')));
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
