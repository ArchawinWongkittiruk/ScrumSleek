import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { endSprint } from '../../actions/sprints';
import {
  Flex,
  Text,
  Button,
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';

import TaskList from './TaskList';

dayjs.extend(relativeTime);

const Sprint = () => {
  const [progress, setProgress] = useState(0);
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINT')
  );
  const statuses = useSelector((state) => state.project.project.statuses);
  const sprint = useSelector((state) => state.project.project.sprint);
  const dispatch = useDispatch();

  useEffect(() => {
    setProgress(
      (tasks.reduce(
        (total, task) =>
          total +
          statuses.findIndex((status) => status._id === task.status) / (statuses.length - 1),
        0
      ) /
        tasks.length) *
        100
    );
  }, [tasks, statuses]);

  const onEndSprint = async (e) => {
    e.preventDefault();
    dispatch(endSprint());
  };

  return (
    <>
      <Flex justify='space-between' wrap='wrap' pb='1rem'>
        <Text fontSize='xl'>Sprint Progress</Text>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme={progress !== 100 ? 'red' : 'green'}>End Sprint</Button>
          </PopoverTrigger>
          <PopoverContent mr='1.5rem'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Are You Sure?</PopoverHeader>
            <PopoverBody>
              <Button onClick={onEndSprint} colorScheme={progress !== 100 ? 'red' : 'green'}>
                Yes, End the Sprint
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Progress
        value={progress}
        borderRadius='5px'
        mb='1rem'
        w='100%'
        colorScheme={
          progress === 100 ? 'green' : progress < 33 ? 'red' : progress < 66 ? 'orange' : 'yellow'
        }
      />
      <Flex wrap='wrap' pb='1rem'>
        <Text pr='1rem'>
          Start: {dayjs(sprint.start).format('DD/MM/YYYY HH:mm')} ({dayjs(sprint.start).fromNow()})
        </Text>
        <Text>
          End: {dayjs(sprint.end).format('DD/MM/YYYY HH:mm')} ({dayjs(sprint.end).fromNow()})
        </Text>
      </Flex>
      <Text>Target - {sprint.target}</Text>
      <TaskList tasks={tasks} />
    </>
  );
};

export default Sprint;
