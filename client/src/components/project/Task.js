import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { editTask } from '../../actions/tasks';
import { Box, Text, Textarea, Button } from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

const Task = ({ task }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [mouseOver, setMouseOver] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(editTask(task._id, { title }));
    setEditing(false);
    setMouseOver(false);
  };

  return !editing ? (
    <Box
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      borderWidth='2px'
      borderRadius='lg'
      w='300px'
      p='1rem'
      m='0 1rem 1rem 0'
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
  ) : (
    <Box w='300px' m='0 1rem 1rem 0'>
      <form onSubmit={(e) => onSubmit(e)}>
        <Textarea
          isRequired
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
          h='8rem'
        />
        <Box>
          <Button type='submit' colorScheme='blue'>
            Save
          </Button>
          <Button
            onClick={() => {
              setEditing(false);
              setMouseOver(false);
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </form>
    </Box>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
};

export default Task;
