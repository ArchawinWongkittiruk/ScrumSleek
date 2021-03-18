const User = require('../models/User');

module.exports = async (req, res, project) => {
  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  for (const member of project.members) {
    const user = await User.findById(member.user);
    user.projects.splice(user.projects.indexOf(project.id), 1);
    await user.save();
  }
  await project.remove();

  req.app.get('io').to(project.id).emit('DELETE_PROJECT', project.id);
};
