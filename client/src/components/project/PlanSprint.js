import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startSprint } from '../../actions/sprints';
import { Flex, Box, Text, Button, Textarea } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';

const PlanSprint = () => {
  const [start, setStart] = useState(new Date());
  const startPlusWeek = new Date();
  startPlusWeek.setDate(startPlusWeek.getDate() + 7);
  const [end, setEnd] = useState(startPlusWeek);
  const [goals, setGoals] = useState('');
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(startSprint({ start, end, goals }));
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
        <Box pt='0.5rem'>
          <Text>Sprint Goals</Text>
          <Textarea
            isRequired
            autoFocus
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            maxWidth='30rem'
            h='10rem'
          />
        </Box>
        <Box>
          <Text>Sprint Tasks - Drop Backlog Tasks Here</Text>
          <Flex borderWidth='2px' borderRadius='lg' w='300px' p='1rem' h='fit-content'>
            {}
          </Flex>
        </Box>
        <Button colorScheme='blue' mt='0.5rem'>
          Start Sprint
        </Button>
      </form>
    </Box>
  );
};

export default PlanSprint;
