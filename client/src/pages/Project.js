import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../socket';
import { getProject } from '../actions/projects';
import {
  RESET_SPRINT_PLAN,
  LEAVE_PROJECT,
  DELETE_PROJECT,
  SET_ACTIVE_MEMBERS,
  SET_IS_MEMBER,
  SET_IS_ADMIN,
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

import Backlog from '../components/views/Backlog';
import PlanSprint from '../components/views/PlanSprint';
import Sprint from '../components/views/Sprint';
import Completed from '../components/views/Completed';
import Statuses from '../components/views/Statuses';
import Roles from '../components/views/Roles';

import ProjectTitle from '../components/project/ProjectTitle';
import ProjectMenu from '../components/project/ProjectMenu';
import Members from '../components/project/Members';

const views = ['Backlog', 'Sprint', 'Completed', 'Statuses', 'Roles'];

const Project = ({ match }) => {
  const [currentView, setCurrentView] = useState('Backlog');
  const [entered, setEntered] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const project = useSelector((state) => state.project.project);
  const isMember = project?.members.some((member) => member.user._id === user?._id);
  const isAdmin = project?.members.some(
    (member) => member.role === 'Admin' && member.user._id === user?._id
  );
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    if (!authLoading && !project) dispatch(getProject(match.params.id));
  }, [dispatch, authLoading, project, match.params.id]);

  useEffect(() => {
    if (project?.title) document.title = project.title + ' | ScrumSleek';
  }, [project?.title]);

  useEffect(() => {
    if (isMember !== undefined) dispatch({ type: SET_IS_MEMBER, payload: isMember });
  }, [dispatch, isMember]);

  useEffect(() => {
    if (isAdmin !== undefined) dispatch({ type: SET_IS_ADMIN, payload: isAdmin });
  }, [dispatch, isAdmin]);

  useEffect(() => {
    const enterProjectRoom = () => {
      socket.emit('ENTER_PROJECT', { isMember, projectId: project._id }, (activeMembers) => {
        if (activeMembers) dispatch({ type: SET_ACTIVE_MEMBERS, payload: activeMembers });
        setEntered(true);
      });
    };

    const goToProjects = () => {
      history.push('/projects');
    };

    const setEnteredFalse = () => {
      setEntered(false);
    };

    if (project?._id) {
      enterProjectRoom();

      socket.on(LEAVE_PROJECT, goToProjects);
      socket.on(DELETE_PROJECT, goToProjects);
      socket.on('disconnect', setEnteredFalse);
      socket.on('connect', enterProjectRoom);

      return () => {
        setEntered(false);
        socket.off(LEAVE_PROJECT, goToProjects);
        socket.off(DELETE_PROJECT, goToProjects);
        socket.off('disconnect', setEnteredFalse);
        socket.off('connect', enterProjectRoom);
        socket.emit('EXIT_PROJECT', { isMember, projectId: project._id });
      };
    }
  }, [dispatch, history, isMember, project?._id]);

  useEffect(() => {
    if (project?.sprintOngoing === false) dispatch({ type: RESET_SPRINT_PLAN });
  }, [dispatch, project?.sprintOngoing]);

  useEffect(() => {
    if (project?.sprintOngoing === true) {
      setCurrentView('Sprint');
    } else if (project?.sprintOngoing === false) {
      setCurrentView('Backlog');
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
            {views.map((view) => (
              <Button
                key={view}
                onClick={() => setCurrentView(view)}
                isDisabled={view === currentView}
              >
                {view}
              </Button>
            ))}
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              display={{ base: 'block', md: 'none' }}
            >
              Views
            </MenuButton>
            <MenuList>
              {views.map((view) => (
                <MenuItem
                  key={view}
                  onClick={() => setCurrentView(view)}
                  isDisabled={view === currentView}
                >
                  {view}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {isMember && <ProjectMenu project={project} />}
        </Flex>
      </Flex>
      {currentView === 'Backlog' ? (
        <Backlog />
      ) : currentView === 'Sprint' ? (
        <>{project.sprintOngoing ? <Sprint /> : <PlanSprint />}</>
      ) : currentView === 'Completed' ? (
        <Completed />
      ) : currentView === 'Statuses' ? (
        <Statuses />
      ) : (
        <Roles />
      )}
    </Box>
  );
};

export default Project;
