import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getProject } from '../actions/project';
import { Box, CircularProgress } from '@chakra-ui/react';

import Navbar from '../components/other/Navbar';
import ProjectTitle from '../components/project/ProjectTitle';

const Project = ({ match }) => {
  const project = useSelector((state) => state.project.project);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <Navbar />
      {!project ? (
        <Box textAlign='center' mt='20%'>
          <CircularProgress isIndeterminate />
        </Box>
      ) : (
        <Box p='1rem'>
          <ProjectTitle project={project} />
        </Box>
      )}
    </>
  );
};

export default Project;
