import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { startSprint } from '../../actions/sprints';
import { Flex, Box, Text, Button, Textarea } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';

import Task from './Task';

const PlanSprint = ({ setPage }) => {
  const [start, setStart] = useState(new Date());
  const startPlusWeek = new Date();
  startPlusWeek.setDate(startPlusWeek.getDate() + 7);
  const [end, setEnd] = useState(startPlusWeek);
  const [target, setTarget] = useState('');
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINTPLAN')
  );
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(startSprint({ start, end, target }));
    setPage('sprint');
  };

  return (
    <Box pt='0.5rem'>
      <Text fontSize='xl'>Sprint Plan</Text>
      <form onSubmit={(e) => onSubmit(e)}>
        <Flex pt='0.5rem' wrap='wrap'>
          <Box pr='1rem'>
            <Text>Start</Text>
            <DateTimePicker required onChange={setStart} value={start} />
          </Box>
          <Box>
            <Text>End</Text>
            <DateTimePicker required onChange={setEnd} value={end} />
          </Box>
        </Flex>
        <Box pt='1rem'>
          <Text>Sprint Target</Text>
          <Textarea
            isRequired
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            maxWidth='30rem'
            h='10rem'
          />
        </Box>
        <Box pt='1rem'>
          <Text>Sprint Tasks</Text>
          <Flex borderWidth='2px' borderRadius='lg' p='1rem' minHeight='10rem'>
            {tasks && tasks.map((task) => <Task task={task} key={task._id} />)}
          </Flex>
        </Box>
        <Button
          type='submit'
          colorScheme='blue'
          mt='0.5rem'
          isDisabled={tasks.length === 0 || !target}
        >
          Start Sprint
        </Button>
      </form>
    </Box>
  );
};

PlanSprint.propTypes = {
  setPage: PropTypes.func.isRequired,
};

export default PlanSprint;
