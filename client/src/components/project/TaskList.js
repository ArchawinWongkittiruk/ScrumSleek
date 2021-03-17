import React, { useState } from 'react';
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
import { Flex, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import CreateTask from './CreateTask';
import Task from './Task';

const sortTypes = [
  'Default',
  'Title',
  'Label',
  'Story Points',
  'Members',
  'Status',
  'Most Recently Created',
  'Least Recently Created',
  'Most Recently Updated',
  'Least Recently Updated',
];

const getSort = (type, statuses, a, b) => {
  switch (type) {
    case 'Title':
      return a.title.localeCompare(b.title);
    case 'Label':
      return a.label.localeCompare(b.label);
    case 'Story Points':
      return b.storyPoints - a.storyPoints;
    case 'Members':
      return b.members.length - a.members.length;
    case 'Status':
      return (
        statuses.findIndex((status) => status._id === a.status) -
        statuses.findIndex((status) => status._id === b.status)
      );
    case 'Most Recently Created':
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    case 'Least Recently Created':
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case 'Most Recently Updated':
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    case 'Least Recently Updated':
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    default:
      return 0;
  }
};

const TaskList = ({ location, sprintId, canCreateTask }) => {
  const [sortType, setSortType] = useState('Default');
  const allTasks = useSelector((state) => state.project.project.tasks);
  const statuses = useSelector((state) => state.project.project.statuses);
  const tasks = (sprintId
    ? allTasks.filter((task) => task.sprintCompleted === sprintId)
    : allTasks.filter((task) => task.location === location)
  ).sort((a, b) => getSort(sortType, statuses, a, b));
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
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='xs' mt='0.5rem'>
          Sort By: {sortType}
        </MenuButton>
        <MenuList>
          {sortTypes.map((type) => (
            <MenuItem key={type} onClick={() => setSortType(type)} isDisabled={sortType === type}>
              {type}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((task) => task._id)} strategy={rectSortingStrategy}>
          <Flex wrap='wrap' pt='1rem'>
            {tasks.map((task) => (
              <Task key={task._id} task={task} sorted={sortType !== 'Default'} />
            ))}
            {canCreateTask && <CreateTask location={location} />}
          </Flex>
        </SortableContext>
      </DndContext>
    </>
  );
};

TaskList.propTypes = {
  location: PropTypes.string.isRequired,
  sprintId: PropTypes.string,
  canCreateTask: PropTypes.bool,
};

export default TaskList;
