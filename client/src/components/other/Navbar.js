import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { logout } from '../../actions/auth';
import {
  Flex,
  Box,
  Text,
  Link,
  Button,
  useColorMode,
  Alert as AlertCUI,
  AlertIcon,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const project = useSelector((state) => state.project.project);
  const isMember =
    user && project ? project.members.map((member) => member.user).includes(user._id) : false;
  const dispatch = useDispatch();

  return (
    <>
      <Flex as='nav' justify='space-between' p='1rem' borderBottom='2px solid lightgrey'>
        <Link as={ReactLink} to='/projects'>
          ScrumSleek
        </Link>
        {isAuthenticated ? (
          <Box>
            <Button onClick={toggleColorMode} mr='1rem' size='xs'>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Link as={ReactLink} to='/' onClick={() => dispatch(logout())}>
              Logout
            </Link>
          </Box>
        ) : (
          <Flex>
            <Button onClick={toggleColorMode} mr='1rem' size='xs'>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Text display={{ base: 'none', md: 'block' }} mr='0.5rem'>
              You are not signed in!
            </Text>
            <Link as={ReactLink} to='/login'>
              Sign In
            </Link>
          </Flex>
        )}
      </Flex>
      {project && !isMember && (
        <AlertCUI>
          <AlertIcon />
          You cannot make changes to this project.
        </AlertCUI>
      )}
    </>
  );
};

export default Navbar;
