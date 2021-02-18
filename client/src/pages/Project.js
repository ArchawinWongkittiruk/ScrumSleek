import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProject } from '../actions/project';
import {
  Button,
  Box,
  Flex,
  CircularProgress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import Navbar from '../components/other/Navbar';
import ProjectTitle from '../components/project/ProjectTitle';
import Backlog from '../components/project/Backlog';
import PlanSprint from '../components/project/PlanSprint';
import Sprint from '../components/project/Sprint';
import ProjectMenu from '../components/project/ProjectMenu';
import Completed from '../components/project/Completed';
import Members from '../components/project/Members';

const Project = ({ match }) => {
  const pages = ['Backlog', 'Sprint', 'Completed'];
  const [currentPage, setCurrentPage] = useState('Backlog');
  const project = useSelector((state) => state.project.project);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project?.title) document.title = project.title + ' | ScrumSleek';
  }, [project?.title]);

  useEffect(() => {
    if (project?.sprint?.ongoing) {
      setCurrentPage('Sprint');
    } else {
      setCurrentPage('Backlog');
    }
  }, [project?.sprint?.ongoing]);

  return (
    <>
      <Navbar />
      {!project ? (
        <Box textAlign='center' mt='20%'>
          <CircularProgress isIndeterminate />
        </Box>
      ) : (
        <Box p='1.5rem'>
          <Flex justify='space-between' alignItems='center' wrap='wrap' minHeight='4rem'>
            <Flex direction={{ base: 'column', md: 'row' }} pb='1rem'>
              <ProjectTitle project={project} />
              <Members />
            </Flex>
            <Flex pb='1rem'>
              <Box display={{ base: 'none', md: 'block' }}>
                {pages.map((page) => (
                  <Button onClick={() => setCurrentPage(page)} isDisabled={page === currentPage}>
                    {page}
                  </Button>
                ))}
              </Box>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  display={{ base: 'block', md: 'none' }}
                >
                  Pages
                </MenuButton>
                <MenuList>
                  {pages.map((page) => (
                    <MenuItem
                      onClick={() => setCurrentPage(page)}
                      isDisabled={page === currentPage}
                    >
                      {page}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <ProjectMenu project={project} />
            </Flex>
          </Flex>
          {currentPage === 'Backlog' ? (
            <Backlog />
          ) : currentPage === 'Sprint' ? (
            <>{project.sprint.ongoing ? <Sprint /> : <PlanSprint />}</>
          ) : (
            <Completed />
          )}
        </Box>
      )}
    </>
  );
};

export default Project;
