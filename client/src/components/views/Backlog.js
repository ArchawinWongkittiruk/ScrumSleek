import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const Backlog = () => {
  const isMember = useSelector((state) => state.project.isMember);

  return (
    <>
      <Flex wrap='wrap' justify='space-between'>
        <Text fontSize='xl'>Backlog</Text>
        <StoryPoints location='BACKLOG' />
      </Flex>
      <TaskList location='BACKLOG' canCreateTask={isMember} />
    </>
  );
};

export default Backlog;
