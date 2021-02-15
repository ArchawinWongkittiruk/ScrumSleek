const isAdmin = (project, user) => {
  return !project.members
    .filter((member) => member.role !== 'admin')
    .map((member) => member.user)
    .includes(user._id);
};

export default isAdmin;
