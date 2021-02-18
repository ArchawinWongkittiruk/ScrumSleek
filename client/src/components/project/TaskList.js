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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { moveTask } from '../../actions/tasks';
import { Flex } from '@chakra-ui/react';

import CreateTask from './CreateTask';
import Task from './Task';

const SortableItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Task task={task} />
    </div>
  );
};

const TaskList = ({ tasks, canCreateTask }) => {
  const allTasks = useSelector((state) => state.project.project.tasks);
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
            <SortableItem key={task._id} task={task} />
          ))}
          {canCreateTask && <CreateTask />}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  canCreateTask: PropTypes.bool,
};

export default TaskList;
