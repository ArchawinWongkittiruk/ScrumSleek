import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const chakraColors = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
];

const ColorPicker = ({ color, setColor }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button rightIcon={<ChevronDownIcon />} colorScheme={color} m='0.5rem 0'>
          Select Color
        </Button>
      </PopoverTrigger>
      <PopoverContent w='14.2rem'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Select Status Color</PopoverHeader>
        <PopoverBody>
          {chakraColors.map((chakraColor) => (
            <Button
              onClick={() => setColor(chakraColor)}
              key={chakraColor}
              value={chakraColor}
              colorScheme={chakraColor}
            />
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
};

export default ColorPicker;
