import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import TaskList from './TaskList';
import StoryPoints from './StoryPoints';

const Completed = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'COMPLETED')
  );

  return (
    <>
      <Flex wrap='wrap' justify='space-between'>
        <Text fontSize='xl'>Completed User Stories</Text>
        <StoryPoints tasks={tasks} />
      </Flex>
      <TaskList tasks={tasks} />
    </>
  );
};

export default Completed;
