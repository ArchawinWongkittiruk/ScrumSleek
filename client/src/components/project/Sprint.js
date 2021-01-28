import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { endSprint } from '../../actions/sprints';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

import Task from './Task';

const Sprint = ({ setPage }) => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINT')
  );
  const sprint = useSelector((state) => state.project.project.sprint);
  const dispatch = useDispatch();

  const onEndSprint = async (e) => {
    e.preventDefault();
    dispatch(endSprint());
    setPage('backlog');
  };

  return (
    <Box>
      <Flex justify='space-between' pb='1rem'>
        <Box>
          <Text fontSize='xl' pb='1rem'>
            Sprint
          </Text>
          <Text>{sprint.target}</Text>
        </Box>
        <Button onClick={onEndSprint} colorScheme='red'>
          End Sprint
        </Button>
      </Flex>
      <Flex wrap='wrap' pt='1rem'>
        {tasks.map((task) => (
          <Task task={task} key={task._id} />
        ))}
      </Flex>
    </Box>
  );
};

Sprint.propTypes = {
  setPage: PropTypes.func.isRequired,
};

export default Sprint;
