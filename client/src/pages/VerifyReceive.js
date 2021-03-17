import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { verifyUser } from '../actions/auth';
import { Box, Text, CircularProgress } from '@chakra-ui/react';

const VerifyReceive = ({ match }) => {
  const verified = useSelector((state) => state.auth.user?.verified);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUser(match.params.token));
  }, [dispatch, match.params.token]);

  if (verified) {
    return <Redirect to='/projects' />;
  }

  return (
    <Box textAlign='center' mt='20%'>
      <Text pb='1rem'>Verifying your email...</Text>
      <CircularProgress isIndeterminate />
    </Box>
  );
};

export default VerifyReceive;
