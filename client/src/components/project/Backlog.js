import React from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@chakra-ui/react';

import TaskList from './TaskList';

const Backlog = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'BACKLOG')
  );

  return (
    <>
      <Text fontSize='xl'>Backlog</Text>
      <TaskList tasks={tasks} canCreateTask />
    </>
  );
};

export default Backlog;
