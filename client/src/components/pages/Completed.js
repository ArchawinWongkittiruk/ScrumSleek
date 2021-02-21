import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const Completed = () => {
  return (
    <>
      <Flex wrap='wrap' justify='space-between'>
        <Text fontSize='xl'>Completed User Stories</Text>
        <StoryPoints location='COMPLETED' />
      </Flex>
      <TaskList location='COMPLETED' />
    </>
  );
};

export default Completed;
