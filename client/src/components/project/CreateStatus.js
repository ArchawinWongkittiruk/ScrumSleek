import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStatus } from '../../actions/statuses';
import { Box, Flex, Input, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import ColorPicker from '../other/ColorPicker';

const CreateStatus = () => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('gray');
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(addStatus({ title, color }));
    setTitle('');
  };

  return (
    <Box mr='0.5rem'>
      {!adding ? (
        <Button onClick={() => setAdding(true)} mb='1rem'>
          + Add a Status
        </Button>
      ) : (
        <form onSubmit={(e) => onSubmit(e)}>
          <Flex direction='column' mb='0.5rem'>
            <Input
              isRequired
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              width='8rem'
            />
            <ColorPicker colorScheme={color} setColor={setColor} m='0.5rem 0' />
            <Box>
              <Button type='submit' size='sm' colorScheme='blue'>
                Add Status
              </Button>
              <Button
                onClick={() => {
                  setAdding(false);
                  setTitle('');
                }}
                size='sm'
              >
                <CloseIcon />
              </Button>
            </Box>
          </Flex>
        </form>
      )}
    </Box>
  );
};

export default CreateStatus;
