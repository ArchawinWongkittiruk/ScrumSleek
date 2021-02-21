const isAdmin = (project, user) => {
  if (!project || !user) return false;
  return project.members
    .filter((member) => member.role === 'Admin')
    .map((member) => member.user)
    .includes(user._id);
};

export default isAdmin;
