import React from 'react';
import { Tooltip, Avatar } from '@chakra-ui/react';

const getInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

const TooltipAvatar = (props) => {
  return (
    <Tooltip hasArrow label={props.name}>
      <Avatar
        bg='gray.300'
        color='gray.700'
        cursor='default'
        {...props}
        name={getInitials(props.name).split('').join(' ')}
      />
    </Tooltip>
  );
};

export default TooltipAvatar;
