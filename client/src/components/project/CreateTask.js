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

  return (
    <Box width='300px' m='0 1rem 1rem 0'>
      {!adding ? (
        <Button onClick={() => setAdding(true)} colorScheme='green'>
          + Add a User Story
        </Button>
      ) : (
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
              Add User Story
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
      )}
    </Box>
  );
};

export default CreateTask;
