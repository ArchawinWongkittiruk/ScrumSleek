import React from 'react';
import { Link as ReactLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/auth';
import { Flex, Link } from '@chakra-ui/react';

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return '';
  }

  return (
    <Flex as='nav' justify='space-between' p='1rem' bg='gray.100'>
      <Link as={ReactLink} to='/projects'>
        Home
      </Link>
      <Link as={ReactLink} to='/projects'>
        ScrumSleek
      </Link>
      <Link as={ReactLink} to='/' onClick={() => dispatch(logout())}>
        Logout
      </Link>
    </Flex>
  );
};

export default Navbar;
