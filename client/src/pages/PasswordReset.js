import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAlert } from '../actions/alert';
import { resetPassword } from '../actions/auth';
import { Button, Input, Flex, Text } from '@chakra-ui/react';

const PasswordReset = ({ match }) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });
  const [resetDisabled, setResetDisabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Password Reset | ScrumSleek';
  }, []);

  const { password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onResetPassword = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match', 'error'));
    } else {
      setResetDisabled(true);

      dispatch(resetPassword(match.params.token, { password }));

      setTimeout(() => {
        setResetDisabled(false);
      }, 5000);
    }
  };

  return (
    <Flex
      justify='center'
      p={{ base: '50px', md: 0 }}
      direction='column'
      m='50px auto'
      align='center'
      textAlign='center'
      maxW='30rem'
    >
      <Text as='h2' fontSize='1.5rem' pb='1rem'>
        Reset your ScrumSleek password
      </Text>
      <form onSubmit={(e) => !resetDisabled && onResetPassword(e)}>
        <Input
          isRequired
          placeholder='New password'
          name='password'
          type='password'
          value={password}
          onChange={(e) => onChange(e)}
          mb='0.5rem'
        />
        <Input
          isRequired
          placeholder='Confirm new password'
          name='password2'
          type='password'
          value={password2}
          onChange={(e) => onChange(e)}
          mb='1rem'
        />
        <Button type='submit' isDisabled={resetDisabled} isFullWidth mb='1rem' colorScheme='blue'>
          Reset Password
        </Button>
      </form>
    </Flex>
  );
};

export default PasswordReset;
