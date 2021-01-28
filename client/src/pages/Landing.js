import React from 'react';
import { Link as ReactLink, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Image, Heading, Text, Button, Flex, Spacer } from '@chakra-ui/react';
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

      <Heading
        as='h1'
        p='1.5rem'
        fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
        textAlign='center'
      >
        Scrum for the next generation of developers
      </Heading>
      <Button as={ReactLink} to='/register' colorScheme='green' mb='1rem'>
        SIGN UP
      </Button>

      <Text
        as='h2'
        fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
        p='3rem'
        maxW='50rem'
        align='center'
      >
        Manage your software development team with the battle-tested Agile framework.
      </Text>
      <Image src={ProjectTeamImage} alt='project_team' />
      <Text
        as='h2'
        fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
        p='3rem'
        maxW='50rem'
        align='center'
      >
        Learn the most effective Scrum practices and increase your team's productivity.
      </Text>
      <Image src={ScrumBoardImage} alt='scrum_board' />

      <Spacer p='0.5rem' />
      <Copyright />
      <Spacer p='0.5rem' />
    </Flex>
  );
};

export default Landing;
