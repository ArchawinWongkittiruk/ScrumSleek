import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setTaskMember } from '../../actions/tasks';
import {
  Flex,
  IconButton,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { EditIcon, DragHandleIcon } from '@chakra-ui/icons';
import { BiUser } from 'react-icons/bi';

const TaskMouseOver = ({ task, setEditing, attributes, listeners }) => {
  const projectMembers = useSelector((state) => state.project.project.members);
  const dispatch = useDispatch();

  const onSetTaskMember = async (e) => {
    dispatch(
      setTaskMember({
        add: e.target.checked,
        taskId: task._id,
        userId: e.target.name,
      })
    );
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconButton
            icon={<BiUser />}
            aria-label='Set Members for User Story'
            position='absolute'
            left='63%'
            top='5px'
            zIndex='1'
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Members</PopoverHeader>
          <PopoverBody>
            <Flex direction='column'>
              {projectMembers.map((member) => (
                <Checkbox
                  key={member.user._id}
                  isChecked={task.members.some((taskMember) => taskMember.user === member.user._id)}
                  onChange={onSetTaskMember}
                  name={member.user._id}
                >
                  {member.user.name}
                </Checkbox>
              ))}
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <IconButton
        onClick={() => setEditing(true)}
        icon={<EditIcon />}
        aria-label='Edit User Story'
        position='absolute'
        left='77%'
        top='5px'
        zIndex='1'
      />
      <DragHandleIcon
        cursor='grab'
        _pressed={{ cursor: 'grabbing' }}
        color='gray.500'
        position='absolute'
        left='90%'
        top='9px'
        zIndex='1'
        boxSize='2rem'
        {...attributes}
        {...listeners}
      />
    </>
  );
};

TaskMouseOver.propTypes = {
  task: PropTypes.object.isRequired,
  setEditing: PropTypes.func.isRequired,
  attributes: PropTypes.object.isRequired,
  listeners: PropTypes.object.isRequired,
};

export default TaskMouseOver;
