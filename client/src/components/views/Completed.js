import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text, Button } from '@chakra-ui/react';

import StoryPoints from '../project/StoryPoints';
import CompletedSprint from '../project/CompletedSprint';

const Completed = () => {
  const [amount, setAmount] = useState(5);
  const sprints = useSelector((state) => state.project.project.sprints);
  const sprintOngoing = useSelector((state) => state.project.project.sprintOngoing);
  const completedSprints = sprintOngoing ? sprints.slice(1, amount + 1) : sprints.slice(0, amount);

  return (
    <>
      <Flex wrap='wrap' justify='space-between' mb='1rem'>
        <Text fontSize='xl'>Completed</Text>
        <StoryPoints location='COMPLETED' />
      </Flex>
      {completedSprints.map((completedSprint) => (
        <CompletedSprint
          key={completedSprint._id}
          sprint={completedSprint}
          number={
            sprints.length - sprints.findIndex((sprint) => sprint._id === completedSprint._id)
          }
        />
      ))}
      {sprints.length > 5 && (
        <Button onClick={() => setAmount(amount + 5)} isDisabled={amount > sprints.length - 1}>
          View More Sprints
        </Button>
      )}
    </>
  );
};

export default Completed;
