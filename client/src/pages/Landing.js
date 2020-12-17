import React from 'react';
import { Image, Heading, Text, Button, Flex, Spacer } from '@chakra-ui/react';
import { Link as ReactLink, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProjectTeamImage from '../images/undraw_project_team_lc5a.svg';
import ScrumBoardImage from '../images/undraw_Scrum_board_re_wk7v.svg';

import Copyright from '../components/other/Copyright';

const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect to='/projects' />;
  }

  return (
    <Flex direction='column' align='center' justify='center' maxW='80rem' m='auto'>
      <Flex as='nav' w='100%' p='1rem'>
        <Text as='h2' fontSize='1.5rem'>
          ScrumSleek
        </Text>
        <Spacer />
        <Button as={ReactLink} to='/login'>
          LOGIN
        </Button>
        <Button as={ReactLink} to='/register' colorScheme='green'>
          SIGN UP
        </Button>
      </Flex>

      <Heading as='h1' pb='1.5rem' fontSize='6xl' textAlign='center'>
        Scrum for the next generation of developers
      </Heading>
      <Button as={ReactLink} to='/register' colorScheme='green' mb='1rem'>
        SIGN UP
      </Button>
      <Flex align='center' justify='space-between'>
        <Text as='h2' fontSize='2rem' pr='3rem' w='25rem' align='center'>
          Manage your software development team with the battle-tested Agile framework.
        </Text>
        <Image src={ProjectTeamImage} alt='project_team' />
      </Flex>
      <Flex align='center' justify='space-between'>
        <Image src={ScrumBoardImage} alt='scrum_board' />
        <Text as='h2' fontSize='2rem' pl='3rem' w='25rem' align='center'>
          Learn the most effective Scrum practices and increase your team's productivity.
        </Text>
      </Flex>
      <Copyright />
    </Flex>
  );
};

export default Landing;
