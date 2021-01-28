import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { editTask, moveTask, deleteTask } from '../../actions/tasks';
import {
  Flex,
  Box,
  Text,
  Textarea,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

const Task = ({ task }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [mouseOver, setMouseOver] = useState(false);
  const sprintOngoing = useSelector((state) => state.project.project.sprint.ongoing);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  const onEditSubmit = async (e) => {
    e.preventDefault();
    dispatch(editTask(task._id, { title }));
    setEditing(false);
    setMouseOver(false);
  };

  const onMove = async (e) => {
    e.preventDefault();
    dispatch(moveTask(task._id, { to: task.location === 'BACKLOG' ? 'SPRINTPLAN' : 'BACKLOG' }));
  };

  const onDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteTask(task._id));
  };

  return !editing ? (
    <Box m='0 1rem 1rem 0'>
      <Box
        onMouseOver={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        borderWidth='2px'
        borderRadius='lg'
        w='300px'
        p='1rem'
        h='fit-content'
        position='relative'
      >
        {mouseOver && (
          <EditIcon
            onClick={() => setEditing(true)}
            cursor='pointer'
            position='absolute'
            left='90%'
            top='0'
            zIndex='1'
            boxSize='1.5rem'
          />
        )}
        <Text>{task.title}</Text>
      </Box>
      {task.location !== 'SPRINT' && !sprintOngoing && (
        <Button onClick={onMove}>
          Move to {task.location === 'BACKLOG' ? 'Sprint Plan' : 'Backlog'}
        </Button>
      )}
    </Box>
  ) : (
    <Box w='300px' m='0 1rem 1rem 0'>
      <Textarea
        isRequired
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onEditSubmit(e)}
        h='8rem'
      />
      <Flex justify='space-between'>
        <Box>
          <Button onClick={onEditSubmit} colorScheme='blue'>
            Save
          </Button>
          <Button
            onClick={() => {
              setEditing(false);
              setMouseOver(false);
              setTitle(task.title);
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme='red'>Delete</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Are You Sure?</PopoverHeader>
            <PopoverBody>
              <Button onClick={onDelete} colorScheme='red'>
                Yes, Delete the Task
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Box>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
};

export default Task;
