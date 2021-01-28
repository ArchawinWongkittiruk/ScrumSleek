import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getProject } from '../actions/project';
import { Button, Box, Flex, CircularProgress } from '@chakra-ui/react';

import Navbar from '../components/other/Navbar';
import ProjectTitle from '../components/project/ProjectTitle';
import Backlog from '../components/project/Backlog';
import PlanSprint from '../components/project/PlanSprint';
import Sprint from '../components/project/Sprint';

const Project = ({ match }) => {
  const [page, setPage] = useState('');
  const project = useSelector((state) => state.project.project);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project) setPage(project.sprint.ongoing ? 'sprint' : 'backlog');
  }, [project]);

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <Navbar />
      {!project || !page ? (
        <Box textAlign='center' mt='20%'>
          <CircularProgress isIndeterminate />
        </Box>
      ) : (
        <Box p='1.5rem'>
          <Flex justify='space-between'>
            <ProjectTitle project={project} />
            <Box>
              <Button onClick={() => setPage('backlog')} isDisabled={page === 'backlog'}>
                Backlog
              </Button>
              <Button
                onClick={() => setPage('sprint')}
                isDisabled={page === 'sprint' || !project.sprint.ongoing}
              >
                Sprint
              </Button>
            </Box>
          </Flex>
          {page === 'backlog' ? (
            <>
              <Backlog />
              {!project.sprint.ongoing && <PlanSprint setPage={setPage} />}
            </>
          ) : (
            <Sprint setPage={setPage} />
          )}
        </Box>
      )}
    </>
  );
};

export default Project;
