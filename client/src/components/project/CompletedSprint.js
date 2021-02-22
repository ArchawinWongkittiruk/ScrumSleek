import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import getDateDisplay from '../../utils/getDateDisplay';
import { Box, Flex, Divider, Text } from '@chakra-ui/react';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const CompletedSprint = ({ sprint, number }) => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'COMPLETED')
  );

  return (
    <Box key={sprint._id} mb='1.5rem'>
      <Flex wrap='wrap' mb='1rem'>
        <Text fontSize='lg' mr='2rem'>
          Sprint {number}
        </Text>
        <StoryPoints location='COMPLETED' sprintId={sprint._id} />
      </Flex>
      <Flex wrap='wrap' mb='0.5rem'>
        <Text pr='1rem'>Start: {getDateDisplay(sprint.start)}</Text>
        <Text>End: {getDateDisplay(sprint.end)}</Text>
      </Flex>
      <Text mb='1rem'>Target - {sprint.target}</Text>
      {tasks.filter((task) => task.sprintCompleted === sprint._id).length === 0 ? (
        <Text mb='1.5rem'>No user stories were completed during this sprint!</Text>
      ) : (
        <Box mb='0.5rem'>
          <Text>Completed User Stories:</Text>
          <TaskList location='COMPLETED' sprintId={sprint._id} />
        </Box>
      )}
      <Divider />
    </Box>
  );
};

CompletedSprint.propTypes = {
  sprint: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
};

export default CompletedSprint;
