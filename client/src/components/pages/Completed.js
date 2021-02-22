import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import StoryPoints from '../project/StoryPoints';
import CompletedSprint from '../project/CompletedSprint';

const Completed = () => {
  const sprints = useSelector((state) => state.project.project.sprints);
  const sprintOngoing = useSelector((state) => state.project.project.sprintOngoing);
  const completedSprints = sprintOngoing ? sprints.slice(1) : sprints;

  return (
    <>
      <Flex wrap='wrap' justify='space-between' mb='1rem'>
        <Text fontSize='xl'>Completed</Text>
        <StoryPoints location='COMPLETED' />
      </Flex>
      {completedSprints.map((sprint, index) => (
        <CompletedSprint
          key={sprint._id}
          sprint={sprint}
          number={completedSprints.length - index}
        />
      ))}
    </>
  );
};

export default Completed;
