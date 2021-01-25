import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../actions/tasks';
import { Box, Textarea, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const CreateTask = () => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(addTask({ title }));
    setTitle('');
  };

  return !adding ? (
    <Box p='0.5rem 0'>
      <Button onClick={() => setAdding(true)} colorScheme='green'>
        + Add a Task
      </Button>
    </Box>
  ) : (
    <Box p='0.5rem 0' maxWidth='300px'>
      <form onSubmit={(e) => onSubmit(e)}>
        <Textarea
          isRequired
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
          h='10rem'
        />
        <Box>
          <Button type='submit' colorScheme='blue'>
            Add Task
          </Button>
          <Button
            onClick={() => {
              setAdding(false);
              setTitle('');
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateTask;
