import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SPRINT_START, SET_SPRINT_END, SET_SPRINT_TARGET } from '../../actions/types';
import { startSprint } from '../../actions/sprints';
import { Flex, Box, Text, Button, Textarea } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import '../../css/DateTimePicker.css';
import '../../css/Calendar.css';
import '../../css/Clock.css';

import Task from './Task';

const PlanSprint = () => {
  const { start, end, target } = useSelector((state) => state.forms);
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINTPLAN')
  );
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(startSprint({ start, end, target }));
  };

  return (
    <>
      <Text fontSize='xl'>Sprint Plan</Text>
      <form onSubmit={(e) => onSubmit(e)}>
        <Flex pt='0.5rem' wrap='wrap'>
          <Box pr='1rem'>
            <Text>Start</Text>
            <DateTimePicker
              required
              onChange={(newDate) => dispatch({ type: SET_SPRINT_START, payload: newDate })}
              value={start}
            />
          </Box>
          <Box>
            <Text>End</Text>
            <DateTimePicker
              required
              onChange={(newDate) => dispatch({ type: SET_SPRINT_END, payload: newDate })}
              value={end}
            />
          </Box>
        </Flex>
        <Box pt='1rem'>
          <Text>Sprint Target</Text>
          <Textarea
            isRequired
            value={target}
            onChange={(e) => dispatch({ type: SET_SPRINT_TARGET, payload: e.target.value })}
            maxWidth='30rem'
            h='10rem'
          />
        </Box>
        <Box pt='1rem'>
          <Text>Sprint Tasks</Text>
          <Flex wrap='wrap' borderWidth='2px' borderRadius='lg' p='1rem' minHeight='10rem'>
            {tasks.map((task) => (
              <Task task={task} key={task._id} />
            ))}
          </Flex>
        </Box>
        <Button
          type='submit'
          colorScheme='blue'
          mt='1rem'
          isDisabled={tasks.length === 0 || !target}
        >
          Start Sprint
        </Button>
      </form>
    </>
  );
};

export default PlanSprint;
