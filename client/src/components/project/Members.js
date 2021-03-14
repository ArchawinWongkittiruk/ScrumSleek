import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addMember } from '../../actions/members';
import { Box, Flex, Button, AvatarGroup, Input } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import TooltipAvatar from '../other/TooltipAvatar';

const Members = () => {
  const [inviting, setInviting] = useState(false);
  const [invitee, setInvitee] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const project = useSelector((state) => state.project.project);
  const isAdmin = useSelector((state) => state.project.isAdmin);
  const members = project.members;
  const dispatch = useDispatch();

  const handleInputValue = async (newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue && newInputValue !== '') {
      const search = (await axios.get(`/api/users/${newInputValue}`)).data
        .slice(0, 1)
        .filter((user) => !members.find((member) => member.user === user._id));
      setUsers(search && search.length > 0 ? search : []);
      if (users.length > 0 && newInputValue === users[0].email) {
        setInvitee(users[0]);
      } else {
        setInvitee(null);
      }
    }
  };

  const onSubmit = async () => {
    if (invitee) dispatch(addMember(invitee._id));
    setInvitee(null);
    setInputValue('');
  };

  return (
    <Flex wrap='wrap' alignItems='center'>
      <AvatarGroup pr='1rem' mb={{ base: '0.5rem', md: 0 }} flexWrap='wrap'>
        {members.map((member) => (
          <TooltipAvatar key={member.user._id} user={member.user} active={member.active} />
        ))}
      </AvatarGroup>
      {isAdmin && (
        <Box>
          {!inviting ? (
            <Button onClick={() => setInviting(true)}>Invite</Button>
          ) : (
            <Flex wrap={{ base: 'wrap', md: 'nowrap' }}>
              <Input
                autoFocus
                placeholder='Invite users by email'
                value={inputValue}
                onChange={(e) => handleInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
                w='20rem'
              />
              <Flex>
                <Button onClick={onSubmit} disabled={!invitee} colorScheme='blue' p='1rem'>
                  Add Member
                </Button>
                <Button onClick={() => setInviting(false)}>
                  <CloseIcon />
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}
    </Flex>
  );
};

export default Members;
