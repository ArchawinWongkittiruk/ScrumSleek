import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link as ReactLink } from 'react-router-dom';
import socket from '../socket';
import { ADD_PROJECT } from '../actions/types';
import getDateDisplay from '../utils/getDateDisplay';
import { Text, Flex, Link, CircularProgress } from '@chakra-ui/react';

import CreateProject from '../components/other/CreateProject';

const Projects = () => {
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.project.projects);
  const loading = useSelector((state) => state.project.projectsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Your Projects | ScrumSleek';
  }, []);

  useEffect(() => {
    const addProjectListener = (project) => {
      dispatch({ type: ADD_PROJECT, payload: project });
    };

    socket.on(ADD_PROJECT, addProjectListener);

    return () => {
      socket.off(ADD_PROJECT, addProjectListener);
    };
  }, [dispatch]);

  if (user && !user.verified) {
    return <Redirect to='/verifySend' />;
  }

  if (!user) {
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
          <Flex
            key={project._id}
            direction='column'
            borderBottom='2px solid lightgrey'
            w='330px'
            textAlign='center'
          >
            <Link as={ReactLink} to={`/project/${project._id}`} fontSize='1.2rem' p='1.8rem'>
              {project.title}
            </Link>
            <Text fontSize='0.8rem' mb='0.2rem'>
              Last Updated: {getDateDisplay(project.updatedAt)}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Projects;
