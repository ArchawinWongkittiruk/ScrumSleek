const User = require('../models/User');

// 'Join' data of project members (user ID and role) and their users (name and avatar)
module.exports = async function getMembers(project) {
  const members = [];
  for (const member of project.members) {
    const { name, avatar } = await User.findById(member.user);
    members.push({ user: member.user, role: member.role, name, avatar });
  }
  return members;
};
