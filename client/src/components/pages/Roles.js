import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRole, removeMember } from '../../actions/members';
import isAdmin from '../../utils/isAdmin';
import {
  Box,
  Flex,
  Divider,
  Text,
  Radio,
  RadioGroup,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { BiTransferAlt } from 'react-icons/bi';

import TooltipAvatar from '../other/TooltipAvatar';

const roles = ['Admin', 'Product Owner', 'Scrum Master', 'Developer'];

const Roles = () => {
  const members = useSelector((state) => state.project.project.members);
  const user = useSelector((state) => state.auth.user);
  const project = useSelector((state) => state.project.project);
  const admin = isAdmin(project, user);
  const dispatch = useDispatch();

  const onChangeRole = async (member, newRole) => {
    dispatch(changeRole(member.user._id, { role: newRole }));
  };

  const onRemoveMember = async (member) => {
    dispatch(removeMember(member.user._id));
  };

  return (
    <>
      <Text fontSize='xl'>Roles</Text>
      <Flex direction='column' mt='0.5rem'>
        {members.map((member) => (
          <Box key={member.user._id}>
            <Flex
              wrap={{ base: 'wrap', md: 'nowrap' }}
              m='0.5rem 0'
              alignItems='center'
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <TooltipAvatar user={member.user} size='xl' m='1rem 0' />
              <Box m='1rem 0 1rem 1.5rem'>
                <RadioGroup
                  onChange={(newRole) => onChangeRole(member, newRole)}
                  value={member.role}
                >
                  {roles.map((role) => (
                    <Radio
                      key={role}
                      value={role}
                      isDisabled={
                        role === 'Admin' ||
                        (admin && member.user._id === user._id) ||
                        (!admin && member.role === 'Admin')
                      }
                      mr='1rem'
                      mb={{ base: '0.4rem', md: 0 }}
                      size='lg'
                    >
                      {role}
                    </Radio>
                  ))}
                </RadioGroup>
                {admin && member.user._id !== user._id && (
                  <Flex wrap='wrap' mt='1rem'>
                    <Popover>
                      <PopoverTrigger>
                        <Button colorScheme='red' mr='1rem' rightIcon={<BiTransferAlt />}>
                          Make Admin
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Are you absolutely sure?</PopoverHeader>
                        <PopoverBody>
                          You will be transferring your project administration rights to this
                          member!
                          <Button
                            onClick={() => onChangeRole(member, 'Admin')}
                            colorScheme='red'
                            mt='0.5rem'
                          >
                            Yes, Transfer My Ownership
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger>
                        <Button colorScheme='red' rightIcon={<CloseIcon />}>
                          Remove
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Are you absolutely sure?</PopoverHeader>
                        <PopoverBody>
                          <Button onClick={() => onRemoveMember(member)} colorScheme='red'>
                            Yes, Remove This Member
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                )}
              </Box>
            </Flex>
            <Divider />
          </Box>
        ))}
      </Flex>
    </>
  );
};

export default Roles;
