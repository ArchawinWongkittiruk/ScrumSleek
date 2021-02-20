import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import Status from './Status';
import CreateStatus from './CreateStatus';

const Statuses = () => {
  const statuses = useSelector((state) => state.project.project.statuses);

  return (
    <>
      <Text fontSize='xl'>Statuses</Text>
      <Flex wrap='wrap' alignItems='center' minHeight='10rem'>
        {statuses.map((status, index) => (
          <Status key={status._id} statuses={statuses} status={status} index={index} />
        ))}
        <CreateStatus />
      </Flex>
    </>
  );
};

export default Statuses;
