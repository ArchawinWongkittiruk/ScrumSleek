import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Flex, Text } from '@chakra-ui/react';

import CreateTask from './CreateTask';
import Task from './Task';

const Backlog = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'BACKLOG')
  );

  return (
    <Box>
      <Text fontSize='xl'>Backlog</Text>
      <Flex wrap='wrap' pt='1rem'>
        {tasks.map((task) => (
          <Task task={task} key={task._id} />
        ))}
        <CreateTask />
      </Flex>
    </Box>
  );
};

export default Backlog;
