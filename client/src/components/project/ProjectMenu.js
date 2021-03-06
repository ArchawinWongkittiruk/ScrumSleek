import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteProject } from '../../actions/projects';
import { leaveProject } from '../../actions/members';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const ProjectMenu = ({ project }) => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.project.isAdmin);
  const dispatch = useDispatch();

  const onDeleteProject = async () => {
    dispatch(deleteProject(project._id));
  };

  const onLeaveProject = async () => {
    dispatch(leaveProject(user._id));
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList p='1rem'>
        {isAdmin ? (
          <Popover>
            <PopoverTrigger>
              <Button colorScheme='red'>Delete Project</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Are You Sure?</PopoverHeader>
              <PopoverBody>
                <Button onClick={onDeleteProject} colorScheme='red'>
                  Yes, Delete the Project
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Popover>
            <PopoverTrigger>
              <Button colorScheme='red'>Leave Project</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Are You Sure?</PopoverHeader>
              <PopoverBody>
                <Button onClick={onLeaveProject} colorScheme='red'>
                  Yes, Leave the Project
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </MenuList>
    </Menu>
  );
};

ProjectMenu.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectMenu;
