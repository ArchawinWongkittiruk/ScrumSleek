import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Flex, Text } from '@chakra-ui/react';

import CreateTask from './CreateTask';
import Task from './Task';
import PlanSprint from './PlanSprint';

const Backlog = () => {
  const backlog = useSelector((state) => state.project.project.backlog);

  return (
    <Box p='5px'>
      <Text fontSize='xl'>Backlog</Text>
      <Flex wrap='wrap' pt='1rem'>
        {backlog && backlog.map((task) => <Task task={task} key={task._id} />)}
        <CreateTask />
      </Flex>
      <PlanSprint />
    </Box>
  );
};

export default Backlog;
