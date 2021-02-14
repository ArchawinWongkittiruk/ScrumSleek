import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { Flex, Box, Link, Button, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return '';
  }

  return (
    <Flex as='nav' justify='space-between' p='1rem' borderBottom='2px solid lightgrey'>
      <Link as={ReactLink} to='/projects'>
        ScrumSleek
      </Link>
      <Box>
        <Button onClick={toggleColorMode} mr='1rem' size='xs'>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Link as={ReactLink} to='/' onClick={() => dispatch(logout())}>
          Logout
        </Link>
      </Box>
    </Flex>
  );
};

export default Navbar;
