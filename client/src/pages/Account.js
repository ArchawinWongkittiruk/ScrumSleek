import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editUser } from '../actions/auth';
import { Box, Text, Flex, Input, Button } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import Navbar from '../components/other/Navbar';
import TooltipAvatar from '../components/other/TooltipAvatar';

const Account = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarValid, setAvatarValid] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Your Account | ScrumSleek';
  }, []);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.avatar) {
      setAvatar(user.avatar);
      setAvatarValid(true);
    } else {
      setAvatarValid(false);
    }
  }, [user]);

  const onEditUser = async (e) => {
    e.preventDefault();
    dispatch(editUser(user._id, { name, avatar }));
  };

  return (
    <>
      <Navbar />
      {user && (
        <Box pt='5vh'>
          <Flex
            direction='column'
            w='40rem'
            maxWidth='90vw'
            margin='auto'
            align='center'
            p='2rem'
            boxShadow='xl'
          >
            <TooltipAvatar
              member={{ name, avatar }}
              onError={() => setAvatarValid(false)}
              size='2xl'
              m='1rem'
            />
            <Box w={{ base: '18rem', md: '30rem' }}>
              <form onSubmit={(e) => onEditUser(e)}>
                <Text>Email</Text>
                <Text as='h1' fontSize='1.2rem' pb='1rem'>
                  {user.email}
                </Text>
                <Text>Name</Text>
                <Input
                  isRequired
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size='lg'
                  mb='1rem'
                />
                <Flex>
                  <Text pr='0.5rem'>Avatar URL</Text>
                  {avatarValid ? <CheckIcon boxSize='1rem' /> : <CloseIcon boxSize='1rem' />}
                </Flex>
                <Input
                  value={avatar}
                  onChange={(e) => {
                    setAvatar(e.target.value);
                    setAvatarValid(true);
                  }}
                  size='lg'
                  mb='1rem'
                />
                <Button
                  type='submit'
                  isDisabled={
                    ((name === '' || name === user.name) && avatar === user.avatar) ||
                    (!avatarValid && avatar !== '')
                  }
                  colorScheme='blue'
                >
                  Save
                </Button>
              </form>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Account;
