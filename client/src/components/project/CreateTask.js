import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask } from '../../actions/tasks';
import { Box, Textarea, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import ColorPicker from '../other/ColorPicker';

const CreateTask = ({ location }) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('gray');
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(addTask({ title, label, location }));
    setTitle('');
  };

  return (
    <Box w='330px' mb='1rem' mr={{ base: '0.5rem', md: '1rem' }}>
      {!adding ? (
        <Button onClick={() => setAdding(true)} colorScheme='green'>
          + Add a User Story
        </Button>
      ) : (
        <form onSubmit={(e) => onSubmit(e)}>
          <ColorPicker
            colorScheme={label}
            setColor={setLabel}
            size='xs'
            mb='0.5rem'
            prompt='Set Label'
          />
          <Textarea
            isRequired
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (title !== '' ? onSubmit(e) : e.preventDefault())
            }
            h='10rem'
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

CreateTask.propTypes = {
  location: PropTypes.string.isRequired,
};

export default CreateTask;
