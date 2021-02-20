import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const Backlog = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'BACKLOG')
  );

  return (
    <>
      <Flex wrap='wrap' justify='space-between'>
        <Text fontSize='xl'>Backlog</Text>
        <StoryPoints tasks={tasks} />
      </Flex>
      <TaskList tasks={tasks} canCreateTask />
    </>
  );
};

export default Backlog;
