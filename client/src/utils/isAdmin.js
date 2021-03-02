const isAdmin = (project, user) => {
  if (!project || !user) return false;
  return project.members
    .filter((member) => member.role === 'Admin')
    .some((member) => member.user._id === user._id);
};

export default isAdmin;
