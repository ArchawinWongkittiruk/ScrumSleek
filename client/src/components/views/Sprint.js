import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endSprint } from '../../actions/sprints';
import getDateDisplay from '../../utils/getDateDisplay';
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

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const Sprint = () => {
  const [progress, setProgress] = useState(0);
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'SPRINT')
  );
  const statuses = useSelector((state) => state.project.project.statuses);
  const sprint = useSelector((state) => state.project.project.sprints[0]);
  const isMember = useSelector((state) => state.project.isMember);
  const dispatch = useDispatch();

  useEffect(() => {
    let totalProgress = 0;
    let totalStoryPoints = 0;
    for (const task of tasks) {
      const statusIndex = statuses.findIndex((status) => status._id === task.status);
      totalProgress += (statusIndex / (statuses.length - 1)) * task.storyPoints;
      totalStoryPoints += task.storyPoints;
    }
    setProgress((totalProgress / totalStoryPoints) * 100);
  }, [tasks, statuses]);

  const onEndSprint = async (e) => {
    e.preventDefault();
    dispatch(endSprint());
  };

  return (
    <>
      <Flex justify='space-between' wrap='wrap' pb='1rem'>
        <Text fontSize='xl'>Sprint Progress</Text>
        <Flex pt={{ base: '0.5rem', md: 0 }}>
          <StoryPoints location='SPRINT' />
          <Popover>
            {isMember && (
              <PopoverTrigger>
                <Button colorScheme={progress !== 100 ? 'red' : 'green'} ml='0.8rem'>
                  End Sprint
                </Button>
              </PopoverTrigger>
            )}
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
        <Text pr='1rem'>Start: {getDateDisplay(sprint.start)}</Text>
        <Text>End: {getDateDisplay(sprint.end)}</Text>
      </Flex>
      <Text maxW='60rem'>Target - {sprint.target}</Text>
      <TaskList location='SPRINT' />
    </>
  );
};

export default Sprint;
