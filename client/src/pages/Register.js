// based on https://github.com/bradtraversy/devconnector_2.0/blob/master/client/src/components/auth/Register.js

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink, Redirect } from 'react-router-dom';
import { setAlert } from '../actions/alert';
import { register } from '../actions/auth';
import { SET_SIGNUP_LOADING } from '../actions/types';
import { Button, Input, Flex, Box, Text, Link } from '@chakra-ui/react';

import Copyright from '../components/other/Copyright';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const user = useSelector((state) => state.auth.user);
  const project = useSelector((state) => state.project.project);
  const signupLoading = useSelector((state) => state.auth.signupLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'ScrumSleek | Sign Up';
  }, []);

  const { name, email, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match', 'error'));
    } else {
      dispatch({ type: SET_SIGNUP_LOADING, payload: true });
      dispatch(register({ name, email, password }));
    }
  };

  if (user) {
    if (project) {
      return <Redirect to={`/project/${project._id}`} />;
    } else {
      return <Redirect to='/projects' />;
    }
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
        borderWidth='2px'
        borderRadius='xl'
      >
        <Text as='h1' fontSize='3rem'>
          ScrumSleek
        </Text>
        <Text as='h2' fontSize='2rem' pb='2rem'>
          Sign Up
        </Text>
        <Flex direction='column' maxWidth='30rem'>
          <form onSubmit={(e) => !signupLoading && onSubmit(e)}>
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
            <Button
              type='submit'
              isLoading={signupLoading}
              isFullWidth
              mb='1rem'
              colorScheme='blue'
            >
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
