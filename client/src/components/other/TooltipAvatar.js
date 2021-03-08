import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Avatar, AvatarBadge } from '@chakra-ui/react';

const getInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

const TooltipAvatar = ({ user: { name, avatar }, active, ...props }) => {
  return (
    <Tooltip hasArrow label={name}>
      <Avatar
        bg='gray.300'
        color='gray.700'
        cursor='default'
        {...props}
        name={getInitials(name).split('').join(' ')}
        src={avatar}
      >
        {active && <AvatarBadge boxSize='1em' bg='green.500' />}
      </Avatar>
    </Tooltip>
  );
};

TooltipAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  active: PropTypes.bool,
};

export default TooltipAvatar;
