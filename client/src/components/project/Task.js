import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Task = ({ task }) => {
  return (
    <Box borderWidth='2px' borderRadius='lg' w='300px' p='1rem' m='0 1rem 1rem 0'>
      <Text key={task._id}>{task.title}</Text>
    </Box>
  );
};

export default Task;
