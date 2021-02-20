import React from 'react';
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

const ColorPicker = ({ setColor, ...props }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button rightIcon={<ChevronDownIcon />} {...props}>
          Select Color
        </Button>
      </PopoverTrigger>
      <PopoverContent w='14.2rem'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Select Color</PopoverHeader>
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

export default ColorPicker;
