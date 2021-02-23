import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';

import Status from '../project/Status';
import CreateStatus from '../project/CreateStatus';

const Statuses = () => {
  const statuses = useSelector((state) => state.project.project.statuses);

  return (
    <>
      <Text fontSize='xl'>Statuses</Text>
      <Flex wrap='wrap' alignItems='center' minHeight='10rem' pt={{ base: '1rem', md: '0' }}>
        {statuses.slice(0, statuses.length - 1).map((status, index) => (
          <Status key={status._id} statuses={statuses} status={status} index={index} />
        ))}
        <CreateStatus />
        <Status
          statuses={statuses}
          status={statuses[statuses.length - 1]}
          index={statuses.length - 1}
        />
      </Flex>
    </>
  );
};

export default Statuses;
