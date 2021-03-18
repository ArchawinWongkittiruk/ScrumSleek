const User = require('../models/User');

module.exports = async (req, res, project) => {
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
  if (clients) {
    for (const clientId of clients) {
      const client = io.sockets.sockets.get(clientId);
      if (client.userId == user.id) io.to(clientId).emit('LEAVE_PROJECT', project.id);
    }
  }

  const payload = { tasks: project.tasks, memberId: user.id };
  io.to(project.id).emit('REMOVE_MEMBER', payload);
};
