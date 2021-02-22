import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { moveTask } from '../../actions/tasks';
import { Flex } from '@chakra-ui/react';

import CreateTask from './CreateTask';
import Task from './Task';

const TaskList = ({ location, sprintId, canCreateTask }) => {
  const allTasks = useSelector((state) => state.project.project.tasks);
  const tasks = sprintId
    ? allTasks.filter((task) => task.sprintCompleted === sprintId)
    : allTasks.filter((task) => task.location === location);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = allTasks.findIndex((task) => task._id === active.id);
      const newIndex = allTasks.findIndex((task) => task._id === over.id);
      dispatch(moveTask(active.id, { oldIndex, newIndex }));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((task) => task._id)} strategy={rectSortingStrategy}>
        <Flex wrap='wrap' pt='1rem'>
          {tasks.map((task) => (
            <Task key={task._id} task={task} />
          ))}
          {canCreateTask && <CreateTask location={location} />}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

TaskList.propTypes = {
  location: PropTypes.string.isRequired,
  sprintId: PropTypes.string,
  canCreateTask: PropTypes.bool,
};

export default TaskList;
