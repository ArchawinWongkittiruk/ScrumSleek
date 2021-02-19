import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { Flex, Text, Link, Button, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  return (
    <Flex as='nav' justify='space-between' p='1rem' borderBottom='2px solid lightgrey'>
      <Link as={ReactLink} to='/projects'>
        ScrumSleek
      </Link>
      <Flex>
        <Button onClick={toggleColorMode} mr='1rem' size='xs'>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        {isAuthenticated ? (
          <Link as={ReactLink} to='/' onClick={() => dispatch(logout())}>
            Logout
          </Link>
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
