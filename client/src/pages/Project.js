import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getProject } from '../actions/project';
import {
  Button,
  Box,
  Flex,
  CircularProgress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import Navbar from '../components/other/Navbar';
import ProjectTitle from '../components/project/ProjectTitle';
import Backlog from '../components/project/Backlog';
import PlanSprint from '../components/project/PlanSprint';
import Sprint from '../components/project/Sprint';
import ProjectMenu from '../components/project/ProjectMenu';
import Completed from '../components/project/Completed';

const Project = ({ match }) => {
  const [page, setPage] = useState('backlog');
  const project = useSelector((state) => state.project.project);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project?.sprint?.ongoing) {
      setPage('sprint');
    } else {
      setPage('backlog');
    }
  }, [project?.sprint?.ongoing]);

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
        <Box p='1.5rem'>
          <Flex justify='space-between' wrap='wrap' minHeight='4rem'>
            <ProjectTitle project={project} />
            <Box minHeight='3rem'>
              <Box display={{ base: 'none', md: 'inline' }}>
                <Button onClick={() => setPage('backlog')} isDisabled={page === 'backlog'}>
                  Backlog
                </Button>
                <Button onClick={() => setPage('sprint')} isDisabled={page === 'sprint'}>
                  Sprint
                </Button>
                <Button onClick={() => setPage('completed')} isDisabled={page === 'completed'}>
                  Completed
                </Button>
              </Box>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  display={{ base: 'inline', md: 'none' }}
                >
                  Pages
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setPage('backlog')} isDisabled={page === 'backlog'}>
                    Backlog
                  </MenuItem>
                  <MenuItem onClick={() => setPage('sprint')} isDisabled={page === 'sprint'}>
                    Sprint
                  </MenuItem>
                  <MenuItem onClick={() => setPage('completed')} isDisabled={page === 'completed'}>
                    Completed
                  </MenuItem>
                </MenuList>
              </Menu>
              <ProjectMenu project={project} />
            </Box>
          </Flex>
          {page === 'backlog' ? (
            <Backlog />
          ) : page === 'sprint' ? (
            <>{project.sprint.ongoing ? <Sprint /> : <PlanSprint />}</>
          ) : (
            <Completed />
          )}
        </Box>
      )}
    </>
  );
};

export default Project;
