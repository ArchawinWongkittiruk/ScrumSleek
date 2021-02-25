import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink, useLocation } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { getProjects } from '../../actions/project';
import { CLEAR_PROJECT } from '../../actions/types';
import {
  Flex,
  Text,
  Link,
  Button,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { ChevronDownIcon } from '@chakra-ui/icons';

import TooltipAvatar from './TooltipAvatar';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const projects = useSelector((state) => state.project.projects);
  const currentProject = useSelector((state) => state.project.project);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (['/projects', '/account'].includes(location.pathname)) dispatch({ type: CLEAR_PROJECT });
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (user && projects.length === 0) dispatch(getProjects());
  }, [dispatch, user, projects.length]);

  return (
    <Flex as='nav' justify='space-between' p='1rem' borderBottom='2px solid lightgrey'>
      <Flex>
        <Link as={ReactLink} to='/projects' pr='1rem'>
          ScrumSleek
        </Link>
        {isAuthenticated && projects.length !== 0 && (
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
        {isAuthenticated && user ? (
          <Menu>
            <MenuButton as={Button} variant='ghost' rightIcon={<ChevronDownIcon />} size='xs'>
              <TooltipAvatar member={user} size='xs' />
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
