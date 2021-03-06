import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink, useLocation } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { getProjects } from '../../actions/projects';
import { CLEAR_PROJECT } from '../../actions/types';
import {
  Flex,
  Text,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { ChevronDownIcon } from '@chakra-ui/icons';

import TooltipAvatar from './TooltipAvatar';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.project.projects);
  const currentProject = useSelector((state) => state.project.project);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (['/projects', '/account'].includes(location.pathname) && currentProject) {
      dispatch({ type: CLEAR_PROJECT });
    }
  }, [dispatch, location.pathname, currentProject]);

  useEffect(() => {
    if (user?._id) dispatch(getProjects());
  }, [dispatch, user?._id]);

  return (
    <Flex as='nav' justify='space-between' p='1rem' borderBottom='2px solid lightgrey'>
      <Flex>
        <Link as={ReactLink} to='/projects' pr='1rem'>
          ScrumSleek
        </Link>
        {user && projects.length !== 0 && (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='xs'>
              Projects
            </MenuButton>
            <MenuList>
              {projects.map((project) => (
                <MenuItem
                  as={ReactLink}
                  key={project._id}
                  to={`/project/${project._id}`}
                  textAlign='center'
                  isDisabled={project._id === currentProject?._id}
                  onClick={() => currentProject && dispatch({ type: CLEAR_PROJECT })}
                >
                  {project.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </Flex>
      <Flex>
        <Button onClick={toggleColorMode} mr='0.5rem' size='xs'>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        {user ? (
          <Menu>
            <MenuButton as={Button} variant='ghost' rightIcon={<ChevronDownIcon />} size='xs'>
              <TooltipAvatar user={user} size='xs' />
            </MenuButton>
            <MenuList>
              <MenuItem as={ReactLink} to='/account' isDisabled={location.pathname === '/account'}>
                Your Account
              </MenuItem>
              <MenuItem as={ReactLink} to='/' onClick={() => dispatch(logout())}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Text display={{ base: 'none', md: 'block' }} mr='0.5rem'>
              You are not signed in!
            </Text>
            <Link as={ReactLink} to='/login'>
              Sign In
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
