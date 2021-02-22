import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Flex, Badge } from '@chakra-ui/react';

const StoryPoints = ({ location, sprintId }) => {
  const statuses = useSelector((state) => state.project.project.statuses);
  const allTasks = useSelector((state) => state.project.project.tasks);
  const tasks = sprintId
    ? allTasks.filter((task) => task.sprintCompleted === sprintId)
    : allTasks.filter((task) => task.location === location);

  return (
    <Flex alignItems='center'>
      <Text>Story Points -</Text>
      <Flex wrap='wrap'>
        {statuses.map((status) => (
          <Badge key={status._id} colorScheme={status.color} ml='0.4rem'>
            {tasks
              .filter((task) => task.status === status._id)
              .reduce((total, task) => total + task.storyPoints, 0)}
          </Badge>
        ))}
      </Flex>
    </Flex>
  );
};

StoryPoints.propTypes = {
  location: PropTypes.string.isRequired,
  sprintId: PropTypes.string,
};

export default StoryPoints;
