import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../socket';
import { getProject } from '../actions/projects';
import {
  RESET_SPRINT_PLAN,
  CLEAR_PROJECT,
  DELETE_PROJECT,
  LEAVE_PROJECT,
  REMOVE_MEMBER,
} from '../actions/types';
import {
  Button,
  Box,
  Flex,
  CircularProgress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert as AlertCUI,
  AlertIcon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import Backlog from '../components/pages/Backlog';
import PlanSprint from '../components/pages/PlanSprint';
import Sprint from '../components/pages/Sprint';
import Completed from '../components/pages/Completed';
import Statuses from '../components/pages/Statuses';
import Roles from '../components/pages/Roles';

import ProjectTitle from '../components/project/ProjectTitle';
import ProjectMenu from '../components/project/ProjectMenu';
import Members from '../components/project/Members';

const pages = ['Backlog', 'Sprint', 'Completed', 'Statuses', 'Roles'];

const Project = ({ match }) => {
  const [currentPage, setCurrentPage] = useState('Backlog');
  const user = useSelector((state) => state.auth.user);
  const project = useSelector((state) => state.project.project);
  const isMember =
    user && project ? project.members.some((member) => member.user._id === user._id) : false;
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project?.title) document.title = project.title + ' | ScrumSleek';
  }, [project?.title]);

  useEffect(() => {
    if (project?._id) {
      socket.connect();

      socket.emit('ENTER_PROJECT', { userId: user?._id, projectId: project._id });

      socket.onAny((type, payload) => {
        dispatch({ type, payload });

        if (type === DELETE_PROJECT || (type === REMOVE_MEMBER && payload.memberId === user?._id)) {
          dispatch({ type: CLEAR_PROJECT });
          dispatch({ type: LEAVE_PROJECT, payload: project._id });
          history.push('/projects');
        }
      });

      return () => {
        socket.offAny();
        socket.disconnect();
      };
    }
  }, [dispatch, history, user?._id, project?._id]);

  useEffect(() => {
    if (project?.sprintOngoing === true) {
      setCurrentPage('Sprint');
    } else if (project?.sprintOngoing === false && currentPage !== 'Completed') {
      setCurrentPage('Backlog');
      dispatch({ type: RESET_SPRINT_PLAN });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, project?.sprintOngoing, project?._id]);

  return !project || !socket.connected ? (
    <Box textAlign='center' mt='20%'>
      <CircularProgress isIndeterminate />
    </Box>
  ) : (
    <Box p='1.5rem'>
      {!isMember && (
        <AlertCUI mb='1rem'>
          <AlertIcon />
          You cannot make changes to this project.
        </AlertCUI>
      )}
      <Flex justify='space-between' alignItems='center' wrap='wrap' minHeight='4rem'>
        <Flex direction={{ base: 'column', md: 'row' }} pb='1rem'>
          <ProjectTitle project={project} />
          <Members />
        </Flex>
        <Flex pb='1rem'>
          <Box display={{ base: 'none', md: 'block' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                isDisabled={page === currentPage}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              display={{ base: 'block', md: 'none' }}
            >
              Pages
            </MenuButton>
            <MenuList>
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  isDisabled={page === currentPage}
                >
                  {page}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <ProjectMenu project={project} />
        </Flex>
      </Flex>
      {currentPage === 'Backlog' ? (
        <Backlog />
      ) : currentPage === 'Sprint' ? (
        <>{project.sprintOngoing ? <Sprint setPage={setCurrentPage} /> : <PlanSprint />}</>
      ) : currentPage === 'Completed' ? (
        <Completed />
      ) : currentPage === 'Statuses' ? (
        <Statuses />
      ) : (
        <Roles />
      )}
    </Box>
  );
};

export default Project;
