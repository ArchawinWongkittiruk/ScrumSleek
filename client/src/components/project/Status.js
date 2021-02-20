import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();

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
        <Text onClick={() => setEditing(true)} cursor='pointer'>
          {status.title}
        </Text>
      ) : (
        <form onSubmit={onEditSubmit}>
          <Input isRequired value={title} onChange={(e) => setTitle(e.target.value)} w='8rem' />
        </form>
      )}
      <ColorPicker colorScheme={status.color} setColor={onChangeColor} m='0.5rem 0' />
      <Flex justify='space-between'>
        {index !== 0 ? (
          <IconButton icon={<ChevronLeftIcon />} onClick={() => onMove(index - 1)} size='sm' />
        ) : (
          <Box w='2rem' />
        )}
        {statuses.length > 3 && (
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
        {index !== statuses.length - 1 ? (
          <IconButton icon={<ChevronRightIcon />} onClick={() => onMove(index + 1)} size='sm' />
        ) : (
          <Box w='2rem' />
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
