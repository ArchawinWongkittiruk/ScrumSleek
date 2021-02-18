import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/react';

import CreateTask from './CreateTask';
import Task from './Task';

const TaskList = ({ tasks, canCreateTask }) => {
  return (
    <Flex wrap='wrap' pt='1rem'>
      {tasks.map((task) => (
        <Task task={task} key={task._id} />
      ))}
      {canCreateTask && <CreateTask />}
    </Flex>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  canCreateTask: PropTypes.bool,
};

export default TaskList;
