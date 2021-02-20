import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStatus } from '../../actions/statuses';
import chakraColors from '../../utils/chakraColors';
import {
  Box,
  Flex,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';

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
            <Popover>
              <PopoverTrigger>
                <Button rightIcon={<ChevronDownIcon />} colorScheme={color} m='0.5rem 0'>
                  Select Color
                </Button>
              </PopoverTrigger>
              <PopoverContent w='14.2rem'>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Select Status Color</PopoverHeader>
                <PopoverBody>
                  {chakraColors.map((chakraColor) => (
                    <Button
                      onClick={() => setColor(chakraColor)}
                      key={chakraColor}
                      value={chakraColor}
                      colorScheme={chakraColor}
                    />
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
