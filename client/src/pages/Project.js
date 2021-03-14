import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../socket';
import { getProject } from '../actions/projects';
import {
  RESET_SPRINT_PLAN,
  DELETE_PROJECT,
  LEAVE_PROJECT,
  END_SPRINT,
  SET_ACTIVE_MEMBERS,
  SET_IS_MEMBER,
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
  const [entered, setEntered] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const canGetProject = useSelector((state) => state.auth.canGetProject);
  const project = useSelector((state) => state.project.project);
  const isMember = project?.members?.some((member) => member.user._id === user?._id);
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    if (canGetProject) dispatch(getProject(match.params.id));
  }, [dispatch, canGetProject, match.params.id]);

  useEffect(() => {
    if (project?.title) document.title = project.title + ' | ScrumSleek';
  }, [project?.title]);

  useEffect(() => {
    if (isMember !== undefined) {
      dispatch({ type: SET_IS_MEMBER, payload: isMember });
    }
  }, [dispatch, isMember]);

  useEffect(() => {
    if (project?._id) {
      setEntered(false);

      socket.emit(
        'ENTER_PROJECT',
        { userId: isMember ? user._id : null, projectId: project._id },
        (activeMembers) => {
          if (activeMembers) dispatch({ type: SET_ACTIVE_MEMBERS, payload: activeMembers });
          setEntered(true);
        }
      );

      socket.onAny((type, payload) => {
        dispatch({ type, payload });

        if (type === DELETE_PROJECT || type === LEAVE_PROJECT) history.push('/projects');
        if (type === END_SPRINT) dispatch({ type: RESET_SPRINT_PLAN });
      });

      return () => {
        socket.offAny();
        socket.emit('EXIT_PROJECT', { userId: isMember ? user._id : null, projectId: project._id });
      };
    }
  }, [dispatch, history, isMember, user?._id, project?._id]);

  useEffect(() => {
    if (project?.sprintOngoing === true) {
      setCurrentPage('Sprint');
    } else if (project?.sprintOngoing === false) {
      setCurrentPage('Backlog');
      dispatch({ type: RESET_SPRINT_PLAN });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, project?._id]);

  return !project || !entered ? (
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
          {isMember && <ProjectMenu project={project} />}
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
