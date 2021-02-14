import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import Task from './Task';

const Completed = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'COMPLETED')
  );

  return (
    <>
      <Text fontSize='xl'>Completed User Stories</Text>
      <Flex wrap='wrap' pt='1rem'>
        {tasks.map((task) => (
          <Task task={task} key={task._id} />
        ))}
      </Flex>
    </>
  );
};

export default Completed;
