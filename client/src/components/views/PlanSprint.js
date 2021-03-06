import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SPRINT_START, SET_SPRINT_END, SET_SPRINT_TARGET } from '../../actions/types';
import { startSprint, setVelocityLimited, setVelocityLimit } from '../../actions/sprints';
import {
  Flex,
  Box,
  Text,
  Button,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import '../../css/DateTimePicker.css';
import '../../css/Calendar.css';
import '../../css/Clock.css';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const PlanSprint = () => {
  const [storyPoints, setStoryPoints] = useState(0);
  const { start, end, target } = useSelector((state) => state.forms);
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINTPLAN')
  );
  const velocityLimited = useSelector((state) => state.project.project.velocityLimited);
  const velocityLimit = useSelector((state) => state.project.project.velocityLimit);
  const isMember = useSelector((state) => state.project.isMember);
  const dispatch = useDispatch();

  useEffect(() => {
    setStoryPoints(tasks.reduce((total, task) => total + task.storyPoints, 0));
  }, [tasks]);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(startSprint({ start, end, target }));
  };

  const onSetVelocityLimited = async () => {
    dispatch(setVelocityLimited({ limited: !velocityLimited }));
  };

  const onSetVelocityLimit = async (newLimit) => {
    if (Number(newLimit) !== velocityLimit) {
      dispatch(setVelocityLimit({ limit: newLimit }));
    }
  };

  return (
    <>
      <Flex wrap='wrap' justify='space-between'>
        <Text fontSize='xl'>Sprint Plan</Text>
        <StoryPoints location='SPRINTPLAN' />
      </Flex>
      <Box pt='1rem'>
        <Text>Sprint Tasks</Text>
        <TaskList location='SPRINTPLAN' canCreateTask={isMember} />
      </Box>
      <Flex wrap='wrap' alignItems='center' pb='0.5rem' minH='3rem'>
        <Text mr='0.5rem'>Velocity Limit</Text>
        <Switch
          isChecked={velocityLimited}
          onChange={onSetVelocityLimited}
          isDisabled={!isMember}
          mr='1rem'
        />
        {velocityLimited && (
          <Flex wrap='wrap' alignItems='center'>
            <Text pr='0.5rem'>{storyPoints} /</Text>
            <NumberInput
              value={velocityLimit}
              onChange={onSetVelocityLimit}
              min={0}
              max={99999}
              isDisabled={!isMember}
              isInvalid={storyPoints > velocityLimit}
              w='6rem'
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
        )}
      </Flex>
      {isMember && (
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
              onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
              maxWidth='60rem'
              h='10rem'
            />
          </Box>
          <Button
            type='submit'
            colorScheme='blue'
            mt='1rem'
            isDisabled={
              tasks.length === 0 || !target || (velocityLimited && storyPoints > velocityLimit)
            }
          >
            Start Sprint
          </Button>
        </form>
      )}
    </>
  );
};

export default PlanSprint;
