import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { endSprint } from '../../actions/sprints';
import {
  Flex,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';

import Task from './Task';

dayjs.extend(relativeTime);

const Sprint = () => {
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINT')
  );
  const sprint = useSelector((state) => state.project.project.sprint);
  const dispatch = useDispatch();

  const onEndSprint = async (e) => {
    e.preventDefault();
    dispatch(endSprint());
  };

  return (
    <>
      <Flex justify='space-between' wrap='wrap' pb='1rem'>
        <Text fontSize='xl'>Sprint</Text>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme='red'>End Sprint</Button>
          </PopoverTrigger>
          <PopoverContent mr='1.5rem'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Are You Sure?</PopoverHeader>
            <PopoverBody>
              <Button onClick={onEndSprint} colorScheme='red'>
                Yes, End the Sprint
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
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

export default Sprint;
