import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { moveTask } from '../../actions/tasks';
import { Flex } from '@chakra-ui/react';

import CreateTask from './CreateTask';
import Task from './Task';

const SortableItem = SortableElement(({ task }) => <Task task={task} />);

const SortableList = SortableContainer(({ allTasks, tasks, canCreateTask }) => {
  return (
    <Flex wrap='wrap' pt='1rem'>
      {tasks.map((task) => (
        <SortableItem
          key={task._id}
          index={allTasks.findIndex((allTask) => allTask._id === task._id)}
          task={task}
        />
      ))}
      {canCreateTask && <CreateTask />}
    </Flex>
  );
});

const TaskList = ({ tasks, canCreateTask }) => {
  const allTasks = useSelector((state) => state.project.project.tasks);
  const dispatch = useDispatch();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const task = allTasks[oldIndex];
    dispatch(moveTask(task._id, { oldIndex, newIndex }));
  };

  return (
    <SortableList
      tasks={tasks}
      onSortEnd={onSortEnd}
      axis='xy'
      allTasks={allTasks}
      canCreateTask={canCreateTask}
    />
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  canCreateTask: PropTypes.bool,
};

export default TaskList;
