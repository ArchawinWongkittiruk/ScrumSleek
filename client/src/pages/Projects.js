import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Link as ReactLink } from 'react-router-dom';
import { Text, Flex, Link, CircularProgress } from '@chakra-ui/react';

import CreateProject from '../components/other/CreateProject';

const Projects = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const projects = useSelector((state) => state.project.projects);
  const loading = useSelector((state) => state.project.projectsLoading);

  useEffect(() => {
    document.title = 'Your Projects | ScrumSleek';
  }, []);

  if (user && !user.verified) {
    return <Redirect to='/verifySend' />;
  }

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <Flex direction='column' align='center' p='50px'>
      <Text as='h1' fontSize='2rem' pb='1rem' textAlign='center'>
        Welcome {user && user.name}
      </Text>
      <Text as='h2' fontSize='1.5rem'>
        Your Projects
      </Text>
      <CreateProject />
      {loading && <CircularProgress isIndeterminate m='40px' />}
      <Flex m='1rem' direction='column' align='center' justify='center'>
        {projects.map((project) => (
          <Link
            as={ReactLink}
            key={project._id}
            to={`/project/${project._id}`}
            borderBottom='2px solid lightgrey'
            p='2rem'
            w='300px'
            textAlign='center'
          >
            {project.title}
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default Projects;
