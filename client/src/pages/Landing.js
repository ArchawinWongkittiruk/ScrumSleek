import React from 'react';
import { Image, Heading, Text, Button, Flex, Spacer } from '@chakra-ui/react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProjectTeamImage from '../images/undraw_project_team_lc5a.svg';
import ScrumBoardImage from '../images/undraw_Scrum_board_re_wk7v.svg';

const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect to='/projects' />;
  }

  return (
    <Flex direction='column' align='center' justify='center' maxW='80rem' m='auto'>
      <Flex as='nav' w='100vw' p='1rem' maxW='80rem'>
        <Text as='h2' fontSize='1.5rem'>
          ScrumSleek
        </Text>
        <Spacer />
        <Link to='/login'>
          <Button>LOGIN</Button>
        </Link>
        <Link to='/register'>
          <Button colorScheme='green'>SIGN UP</Button>
        </Link>
      </Flex>

      <Heading as='h1' pb='1.5rem' fontSize='6xl' textAlign='center'>
        Scrum for the next generation of developers
      </Heading>
      <Link to='/register'>
        <Button colorScheme='green' mb='1rem'>
          SIGN UP
        </Button>
      </Link>
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
      <Text pt='1rem'>© {new Date().getFullYear()} Archawin Wongkittiruk</Text>
    </Flex>
  );
};

export default Landing;
