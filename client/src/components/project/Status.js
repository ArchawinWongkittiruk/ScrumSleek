import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { editStatus, changeStatusColor, moveStatus, deleteStatus } from '../../actions/statuses';
import {
  Box,
  Flex,
  Button,
  IconButton,
  Text,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';

import ColorPicker from '../other/ColorPicker';

const Status = ({ statuses, status, index }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(status.title);
  const isMember = useSelector((state) => state.project.isMember);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(status.title);
  }, [status.title]);

  const onEditSubmit = async (e) => {
    e.preventDefault();
    dispatch(editStatus(status._id, { title }));
    setEditing(false);
  };

  const onChangeColor = (newColor) => {
    dispatch(changeStatusColor(status._id, { color: newColor }));
  };

  const onMove = async (newIndex) => {
    dispatch(moveStatus(status._id, { oldIndex: index, newIndex }));
  };

  const onDelete = async () => {
    dispatch(deleteStatus(status._id));
  };

  return (
    <Box pr='0.5rem' pb='0.5rem'>
      {!editing ? (
        <Text onClick={() => isMember && setEditing(true)} cursor='pointer'>
          {status.title}
        </Text>
      ) : (
        <form onSubmit={onEditSubmit}>
          <Input isRequired value={title} onChange={(e) => setTitle(e.target.value)} w='8rem' />
        </form>
      )}
      <ColorPicker
        colorScheme={status.color}
        setColor={onChangeColor}
        isDisabled={!isMember}
        m='0.5rem 0'
      />
      <Flex justify='space-between'>
        {index > 1 && index < statuses.length - 1 && isMember ? (
          <IconButton icon={<ChevronLeftIcon />} onClick={() => onMove(index - 1)} size='sm' />
        ) : (
          <Box w='2rem' h='2rem' />
        )}
        {index > 0 && index < statuses.length - 1 && isMember && (
          <Popover>
            <PopoverTrigger>
              <IconButton icon={<DeleteIcon />} colorScheme='red' size='sm'>
                Delete
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Are You Sure?</PopoverHeader>
              <PopoverBody>
                <Button onClick={onDelete} colorScheme='red'>
                  Yes, Delete the Status
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        {index > 0 && index < statuses.length - 2 && isMember ? (
          <IconButton icon={<ChevronRightIcon />} onClick={() => onMove(index + 1)} size='sm' />
        ) : (
          <Box w='2rem' h='2rem' />
        )}
      </Flex>
    </Box>
  );
};

Status.propTypes = {
  statuses: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default Status;
