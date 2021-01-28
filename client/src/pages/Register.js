import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink, Redirect } from 'react-router-dom';
import { setAlert } from '../actions/alert';
import { register } from '../actions/auth';
import { Button, Input, Flex, Box, Text, Link } from '@chakra-ui/react';

import Copyright from '../components/other/Copyright';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const { name, email, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match', 'error'));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/projects' />;
  }

  return (
    <Box textAlign='center' bg='gray.100' height='100vh' pt='10vh'>
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
          Sign Up
        </Text>
        <Flex direction='column' maxWidth='30rem'>
          <form onSubmit={(e) => onSubmit(e)}>
            <Input
              isRequired
              placeholder='Your Name'
              name='name'
              autoComplete='name'
              autoFocus
              value={name}
              onChange={(e) => onChange(e)}
              mb='0.5rem'
            />
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
              mb='0.5rem'
            />
            <Input
              isRequired
              placeholder='Confirm Password'
              name='password2'
              type='password'
              value={password2}
              onChange={(e) => onChange(e)}
              mb='1rem'
            />
            <Button type='submit' isFullWidth mb='1rem' colorScheme='blue'>
              Sign Up
            </Button>
          </form>
          <Flex justify='flex-end'>
            <Link as={ReactLink} to='/login'>
              Already have an account? Sign In
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

export default Register;
