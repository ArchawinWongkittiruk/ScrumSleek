import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { editReviewRetrospective } from '../../actions/sprints';
import getDateDisplay from '../../utils/getDateDisplay';
import { Box, Flex, Divider, Button, Text, Textarea } from '@chakra-ui/react';

import TaskList from '../project/TaskList';
import StoryPoints from '../project/StoryPoints';

const CompletedSprint = ({ sprint, number }) => {
  const [review, setReview] = useState(sprint.review);
  const [retrospective, setRetrospective] = useState(sprint.retrospective);
  const tasks = useSelector((state) =>
    state.project.project.tasks.filter((task) => task.location === 'COMPLETED')
  );
  const isMember = useSelector((state) => state.project.isMember);
  const dispatch = useDispatch();

  useEffect(() => {
    setReview(sprint.review);
    setRetrospective(sprint.retrospective);
  }, [sprint.review, sprint.retrospective]);

  const onEditReviewRetrospective = () => {
    dispatch(editReviewRetrospective(sprint._id, { review, retrospective }));
  };

  return (
    <Box key={sprint._id} mb='1.5rem'>
      <Flex wrap='wrap' mb='1rem'>
        <Text fontSize='lg' mr='2rem'>
          Sprint {number}
        </Text>
        <StoryPoints location='COMPLETED' sprintId={sprint._id} />
      </Flex>
      <Flex wrap='wrap' mb='1rem'>
        <Text pr='1rem'>Start: {getDateDisplay(sprint.start)}</Text>
        <Text>End: {getDateDisplay(sprint.end)}</Text>
      </Flex>
      <Text mb='1rem' maxW='60rem'>
        Target - {sprint.target}
      </Text>
      {tasks.filter((task) => task.sprintCompleted === sprint._id).length === 0 ? (
        <Text mb='1rem'>No user stories were completed!</Text>
      ) : (
        <Box>
          <Text>Completed User Stories:</Text>
          <TaskList location='COMPLETED' sprintId={sprint._id} />
        </Box>
      )}
      <Flex wrap='wrap' mb='0.5rem'>
        <Box mr={{ base: 0, md: '1rem' }} w='30rem'>
          <Text>Review</Text>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            isDisabled={!isMember}
            h='10rem'
          />
        </Box>
        <Box w='30rem'>
          <Text>Retrospective</Text>
          <Textarea
            value={retrospective}
            onChange={(e) => setRetrospective(e.target.value)}
            isDisabled={!isMember}
            h='10rem'
          />
        </Box>
      </Flex>
      {isMember && (
        <Button
          onClick={onEditReviewRetrospective}
          isDisabled={review === sprint.review && retrospective === sprint.retrospective}
          colorScheme='blue'
        >
          Save
        </Button>
      )}
      <Divider mt='1.5rem' />
    </Box>
  );
};

CompletedSprint.propTypes = {
  sprint: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
};

export default CompletedSprint;
