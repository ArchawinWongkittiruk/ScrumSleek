import React, { useState } from 'react';
import { Link as ReactLink, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../actions/auth';
import { Button, Input, Flex, Box, Text, Link } from '@chakra-ui/react';

import Copyright from '../components/other/Copyright';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  if (isAuthenticated) {
    return <Redirect to='/projects' />;
  }

  return (
    <Box textAlign='center' bg='gray.100' height='100vh' pt='10vh'>
      <Flex
        direction='column'
        w='40rem'
        margin='auto'
        align='center'
        p='2rem'
        boxShadow='xl'
        bg='white'
      >
        <Text as='h1' fontSize='3rem'>
          ScrumSleek
        </Text>
        <Text as='h2' fontSize='2rem' pb='2rem'>
          Sign In
        </Text>
        <form onSubmit={(e) => onSubmit(e)}>
          <Flex direction='column' w='30rem'>
            <Input
              isRequired
              placeholder='Email Address'
              name='email'
              autoComplete='email'
              value={email}
              onChange={(e) => onChange(e)}
              mb='0.5rem'
            />
            <Input
              isRequired
              placeholder='Password'
              name='password'
              type='password'
              value={password}
              onChange={(e) => onChange(e)}
              mb='1rem'
            />
          </Flex>
          <Button type='submit' isFullWidth mb='1rem' colorScheme='blue'>
            Sign In
          </Button>
          <Flex justify='flex-end'>
            <Link as={ReactLink} to='/register'>
              Don't have an account? Sign Up
            </Link>
          </Flex>
        </form>
      </Flex>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default Login;
