import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { resendVerify } from '../actions/auth';
import { Flex, Text, Button } from '@chakra-ui/react';

const VerifySend = () => {
  const [sendDisabled, setSendDisabled] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Verify Email | ScrumSleek';
  }, []);

  const onSend = () => {
    setSendDisabled(true);

    dispatch(resendVerify(user));

    setTimeout(() => {
      setSendDisabled(false);
    }, 5000);
  };

  if (user?.verified) {
    return <Redirect to='/projects' />;
  }

  if (!user) {
    return <Redirect to='/' />;
  }

  return (
    <Flex justify='center' p='50px' direction='column' m='auto' align='center' textAlign='center'>
      <Text as='h1' fontSize='2rem' pb='1rem'>
        Welcome {user?.name}
      </Text>
      <Text as='h2' fontSize='1.5rem' pb='1rem'>
        Please verify your email at {user?.email}
      </Text>
      <Button
        onClick={onSend}
        isDisabled={sendDisabled}
        colorScheme='teal'
        variant='outline'
        mb='1rem'
      >
        Resend Verification Email
      </Button>
    </Flex>
  );
};

export default VerifySend;
