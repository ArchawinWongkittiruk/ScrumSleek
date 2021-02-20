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
    <Box>
      {!adding ? (
        <Button onClick={() => setAdding(true)} mr='0.5rem'>
          +
        </Button>
      ) : (
        <form onSubmit={(e) => onSubmit(e)}>
          <Flex direction='column'>
            <Input
              isRequired
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              width='8rem'
            />
            <ColorPicker color={color} setColor={setColor} />
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
