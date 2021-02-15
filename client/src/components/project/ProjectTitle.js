import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { renameProject } from '../../actions/project';
import { Box, Text, Input } from '@chakra-ui/react';

const ProjectTitle = ({ project }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(project.title);
  }, [project.title]);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(renameProject(project._id, { title }));
    setEditing(false);
  };

  return (
    <Box minHeight='3rem'>
      {!editing ? (
        <Text onClick={() => setEditing(true)} fontSize='2xl' cursor='pointer' w='fit-content'>
          {project.title}
        </Text>
      ) : (
        <form onSubmit={(e) => onSubmit(e)}>
          <Input
            isRequired
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxWidth='25rem'
            size='lg'
          />
        </form>
      )}
    </Box>
  );
};

ProjectTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectTitle;
