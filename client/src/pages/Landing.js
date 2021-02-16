import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as ReactLink, Redirect } from 'react-router-dom';
import { Image, Heading, Text, Button, Flex, Spacer, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import ProjectTeamImage from '../images/undraw_project_team_lc5a.svg';
import ScrumBoardImage from '../images/undraw_Scrum_board_re_wk7v.svg';

import Copyright from '../components/other/Copyright';

const Landing = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    document.title = 'ScrumSleek';
  });

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
        <Button onClick={toggleColorMode} mr='0.5rem' size='sm'>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Button
          as={ReactLink}
          to='/login'
          width={{ base: '4.2rem', md: '5rem' }}
          height={{ base: '2rem', md: '2.5rem' }}
        >
          LOGIN
        </Button>
        <Button
          as={ReactLink}
          to='/register'
          colorScheme='green'
          width={{ base: '4.8rem', md: '6rem' }}
          height={{ base: '2rem', md: '2.5rem' }}
        >
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
