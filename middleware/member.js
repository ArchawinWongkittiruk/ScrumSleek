const Project = require('../models/Project');

module.exports = async function (req, res, next) {
  const project = await Project.findById(req.header('projectId'));
  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  const members = project.members.map((member) => member.user);
  if (members.includes(req.user.id)) {
    next();
  } else {
    res.status(401).json({ msg: 'You must be a member of this project to make changes' });
  }
};
