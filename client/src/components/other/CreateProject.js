import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addProject } from '../../actions/project';
import {
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

const CreateProject = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  let history = useHistory();

  const initialRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(addProject({ title }, history));
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme='green' mt='1rem'>
        Create new project
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new project</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb='1rem'>
            <form onSubmit={(e) => onSubmit(e)}>
              <Input
                ref={initialRef}
                isRequired
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button colorScheme='blue' isFullWidth type='submit' mt='0.5rem'>
                Create Project
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateProject;
