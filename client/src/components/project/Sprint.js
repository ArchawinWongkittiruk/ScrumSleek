import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { endSprint } from '../../actions/sprints';
import { Flex, Text, Button } from '@chakra-ui/react';

import Task from './Task';

dayjs.extend(relativeTime);

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
    <>
      <Flex justify='space-between' wrap='wrap' pb='1rem'>
        <Text fontSize='xl'>Sprint</Text>
        <Button onClick={onEndSprint} colorScheme='red'>
          End Sprint
        </Button>
      </Flex>
      <Flex wrap='wrap' pb='1rem'>
        <Text pr='1rem'>
          Start: {dayjs(sprint.start).format('DD/MM/YYYY HH:mm')} ({dayjs(sprint.start).fromNow()})
        </Text>
        <Text>
          End: {dayjs(sprint.end).format('DD/MM/YYYY HH:mm')} ({dayjs(sprint.end).fromNow()})
        </Text>
      </Flex>
      <Text>Target - {sprint.target}</Text>
      <Flex wrap='wrap' pt='1rem'>
        {tasks.map((task) => (
          <Task task={task} key={task._id} />
        ))}
      </Flex>
    </>
  );
};

Sprint.propTypes = {
  setPage: PropTypes.func.isRequired,
};

export default Sprint;
