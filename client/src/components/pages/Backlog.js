import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const Backlog = () => {
  return (
    <>
      <Flex wrap='wrap' justify='space-between'>
        <Text fontSize='xl'>Backlog</Text>
        <StoryPoints location='BACKLOG' />
      </Flex>
      <TaskList location='BACKLOG' canCreateTask />
    </>
  );
};

export default Backlog;
