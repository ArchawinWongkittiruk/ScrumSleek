import React from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@chakra-ui/react';

import TaskList from './TaskList';

const Completed = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'COMPLETED')
  );

  return (
    <>
      <Text fontSize='xl'>Completed User Stories</Text>
      <TaskList tasks={tasks} />
    </>
  );
};

export default Completed;
