import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink, Redirect } from 'react-router-dom';
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
    <Box textAlign='center' height='100vh' pt='10vh'>
      <Flex
        direction='column'
        w='40rem'
        maxWidth='90vw'
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
        <Flex direction='column' maxWidth='30rem'>
          <form onSubmit={(e) => onSubmit(e)}>
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
            <Button type='submit' isFullWidth mb='1rem' colorScheme='blue'>
              Sign In
            </Button>
          </form>
          <Flex justify='flex-end'>
            <Link as={ReactLink} to='/register'>
              Don't have an account? Sign Up
            </Link>
          </Flex>
        </Flex>
      </Flex>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default Login;
