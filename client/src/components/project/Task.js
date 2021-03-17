import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  editTask,
  moveTask,
  changeTaskStatus,
  changeTaskStoryPoints,
  deleteTask,
} from '../../actions/tasks';
import {
  Flex,
  Box,
  Text,
  Textarea,
  AvatarGroup,
  Button,
  Radio,
  RadioGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorMode,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import TooltipAvatar from '../other/TooltipAvatar';
import ColorPicker from '../other/ColorPicker';
import TaskMouseOver from './TaskMouseOver';

const Task = ({ task, sorted }) => {
  const { colorMode } = useColorMode();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [label, setLabel] = useState(task.label);
  const [mouseOver, setMouseOver] = useState(false);
  const projectMembers = useSelector((state) => state.project.project.members);
  const sprintOngoing = useSelector((state) => state.project.project.sprintOngoing);
  const statuses = useSelector((state) => state.project.project.statuses);
  const isMember = useSelector((state) => state.project.isMember);
  const status = statuses.find((status) => status._id === task.status);
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setTitle(task.title);
    setLabel(task.label);
  }, [task.title, task.label]);

  const onEditSubmit = async (e) => {
    e.preventDefault();
    dispatch(editTask(task._id, { title, label }));
    setEditing(false);
    setMouseOver(false);
  };

  const onMove = async () => {
    dispatch(moveTask(task._id, { to: task.location === 'BACKLOG' ? 'SPRINTPLAN' : 'BACKLOG' }));
  };

  const onChangeStatus = async (newStatus) => {
    dispatch(changeTaskStatus(task._id, { status: newStatus }));
  };

  const onChangeTaskStoryPoints = async (newEstimate) => {
    if (Number(newEstimate) !== task.storyPoints) {
      dispatch(changeTaskStoryPoints(task._id, { storyPoints: newEstimate }));
    }
  };

  const onDelete = async () => {
    dispatch(deleteTask(task._id));
  };

  return (
    <Box ref={setNodeRef} style={dndStyle} w='330px' mb='1rem' mr={{ base: '0.5rem', md: '1rem' }}>
      {!editing ? (
        <>
          <Box
            onMouseOver={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            borderWidth='2px'
            borderRadius='lg'
            p='1rem'
            h='fit-content'
            position='relative'
          >
            {mouseOver && isMember && (
              <TaskMouseOver
                task={task}
                setEditing={setEditing}
                attributes={attributes}
                listeners={listeners}
                sorted={sorted}
              />
            )}
            {task.label !== 'gray' && (
              <Box
                bg={task.label + (colorMode === 'light' ? '.500' : '.300')}
                h='8px'
                w='20%'
                mb='10px'
                borderRadius='5px'
              />
            )}
            <Text pb={task.members.length > 0 ? '10px' : '15px'}>{task.title}</Text>
            {task.members.length > 0 && (
              <AvatarGroup pb='15px' flexWrap='wrap'>
                {task.members.map((taskMember) => (
                  <TooltipAvatar
                    key={taskMember.user}
                    user={projectMembers.find((member) => member.user._id === taskMember.user).user}
                    size='sm'
                  />
                ))}
              </AvatarGroup>
            )}
            {task.location !== 'COMPLETED' && (
              <>
                <Box
                  bg={status.color + (colorMode === 'light' ? '.500' : '.300')}
                  h='4px'
                  w='100%'
                  mb='10px'
                  borderRadius='5px'
                />
                <RadioGroup onChange={onChangeStatus} value={status._id}>
                  <Flex wrap='wrap'>
                    {statuses.map((status) => (
                      <Radio
                        key={status._id}
                        value={status._id}
                        isDisabled={task.location !== 'SPRINT' || !isMember}
                        mr='15px'
                      >
                        {status.title}
                      </Radio>
                    ))}
                  </Flex>
                </RadioGroup>
              </>
            )}
          </Box>
          <Flex justify='space-between'>
            {!['SPRINT', 'COMPLETED'].includes(task.location) && !sprintOngoing && isMember ? (
              <Button onClick={onMove} size='sm'>
                Move to {task.location === 'BACKLOG' ? 'Sprint Plan' : 'Backlog'}
              </Button>
            ) : (
              <Box />
            )}
            <NumberInput
              value={task.storyPoints}
              onChange={onChangeTaskStoryPoints}
              min={0}
              max={999}
              isDisabled={task.location === 'COMPLETED' || !isMember}
              size='sm'
              w='4.5rem'
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
        </>
      ) : (
        <>
          <ColorPicker
            colorScheme={label}
            setColor={setLabel}
            size='xs'
            mb='0.5rem'
            prompt='Set Label'
          />
          <Textarea
            isRequired
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (title !== '' ? onEditSubmit(e) : e.preventDefault())
            }
            h='10rem'
          />
          <Flex justify='space-between'>
            <Box>
              <Button onClick={onEditSubmit} colorScheme='blue'>
                Save
              </Button>
              <Button
                onClick={() => {
                  setEditing(false);
                  setMouseOver(false);
                  setTitle(task.title);
                  setLabel(task.label);
                }}
              >
                <CloseIcon />
              </Button>
            </Box>
            <Popover>
              <PopoverTrigger>
                <Button colorScheme='red'>Delete</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Are You Sure?</PopoverHeader>
                <PopoverBody>
                  <Button onClick={onDelete} colorScheme='red'>
                    Yes, Delete the Task
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </>
      )}
    </Box>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  sorted: PropTypes.bool,
};

export default Task;
