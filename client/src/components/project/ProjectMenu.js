import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import isAdmin from '../../utils/isAdmin';
import { deleteProject, leaveProject } from '../../actions/project';
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
  const dispatch = useDispatch();
  let history = useHistory();

  const onDeleteProject = async () => {
    dispatch(deleteProject(project._id, history));
  };

  const onLeaveProject = async () => {
    dispatch(leaveProject(user._id, history));
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList p='1rem'>
        {isAdmin(project, user) ? (
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
