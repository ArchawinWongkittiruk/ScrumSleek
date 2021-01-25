import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link as ReactLink } from 'react-router-dom';
import { getProjects } from '../actions/project';
import { Button, Text, Flex, CircularProgress } from '@chakra-ui/react';

import Navbar from '../components/other/Navbar';
import CreateProject from '../components/other/CreateProject';

const Projects = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const projects = useSelector((state) => state.project.projects);
  const loading = useSelector((state) => state.project.projectsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch, user]);

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <Navbar />
      <Flex direction='column' align='center' p='50px'>
        <Text as='h1' fontSize='2rem' pb='1rem'>
          Welcome {user && user.name}
        </Text>
        <Text as='h2' fontSize='1.5rem'>
          Your Projects
        </Text>
        <CreateProject />
        {loading && <CircularProgress isIndeterminate m='40px' />}
        <Flex m='1rem' direction='row' wrap='wrap' align='center' justify='center'>
          {projects.map((project) => (
            <Button
              as={ReactLink}
              key={project._id}
              to={`/project/${project._id}`}
              w='220px'
              h='120px'
              m='20px'
              color='white'
              backgroundColor='#5067c5'
              _hover={{ backgroundColor: '#4057b5' }}
            >
              {project.title}
            </Button>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default Projects;
