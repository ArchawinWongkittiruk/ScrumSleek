import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editUser, sendPasswordReset, deleteUser } from '../actions/auth';
import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import TooltipAvatar from '../components/other/TooltipAvatar';

const Account = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarValid, setAvatarValid] = useState(true);
  const [resetDisabled, setResetDisabled] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const cancelDeleteRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const isDemoUser = user?.email === 'demo-user@scrumsleek.com';
  const dispatch = useDispatch();
  let history = useHistory();

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
    if (!isDemoUser) dispatch(editUser(user._id, { name, avatar }));
  };

  const onSendResetPassword = () => {
    setResetDisabled(true);

    if (!isDemoUser) dispatch(sendPasswordReset(user.email));

    setTimeout(() => {
      setResetDisabled(false);
    }, 5000);
  };

  const onDeleteUser = () => {
    if (!isDemoUser) dispatch(deleteUser(user._id, history));
  };

  return (
    user && (
      <Box m='5vh auto'>
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
          <TooltipAvatar
            user={{ name, avatar }}
            onError={() => setAvatarValid(false)}
            size='2xl'
            m='1rem'
          />
          <Box w={{ base: '18rem', md: '30rem' }}>
            <Text>Email</Text>
            <Text as='h1' fontSize='1.2rem' pb='1rem'>
              {user.email}
            </Text>
            <Button
              onClick={onSendResetPassword}
              isDisabled={resetDisabled || isDemoUser}
              colorScheme='red'
              variant='outline'
              mb='1rem'
            >
              Send Password Reset
            </Button>
            <form onSubmit={(e) => onEditUser(e)}>
              <Text>Name</Text>
              <Input
                isRequired
                value={name}
                onChange={(e) => setName(e.target.value)}
                isDisabled={isDemoUser}
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
                isDisabled={isDemoUser}
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
                mb='1rem'
              >
                Save
              </Button>
            </form>
            <Button
              onClick={() => setDeleteAlertOpen(true)}
              isDisabled={isDemoUser}
              colorScheme='red'
            >
              Delete My Account
            </Button>
            <AlertDialog
              isOpen={deleteAlertOpen}
              leastDestructiveRef={cancelDeleteRef}
              onClose={() => setDeleteAlertOpen(false)}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete My Account
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you absolutely sure? You will be also be deleting all the projects that you
                    are the admin of, and leaving all the other projects that you are a member of.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button colorScheme='red' onClick={onDeleteUser}>
                      Yes, Delete My Account
                    </Button>
                    <Button
                      ref={cancelDeleteRef}
                      onClick={() => setDeleteAlertOpen(false)}
                      ml='1rem'
                    >
                      Cancel
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Box>
        </Flex>
      </Box>
    )
  );
};

export default Account;
