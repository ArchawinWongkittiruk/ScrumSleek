const Project = require('../models/Project');

module.exports = async function (req, res, next) {
  const project = await Project.findById(req.header('projectId'));
  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  const admins = project.members
    .filter((member) => member.role === 'admin')
    .map((member) => member.user);
  if (admins.includes(req.user.id)) {
    next();
  } else {
    res.status(401).json({ msg: 'You must be an admin of this project to do this' });
  }
};
