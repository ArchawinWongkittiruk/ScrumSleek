import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Avatar } from '@chakra-ui/react';

const getInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

const TooltipAvatar = ({ user, ...props }) => {
  const { name, avatar } = user;

  return (
    <Tooltip hasArrow label={name}>
      <Avatar
        bg='gray.300'
        color='gray.700'
        cursor='default'
        {...props}
        name={getInitials(name).split('').join(' ')}
        src={avatar}
      />
    </Tooltip>
  );
};

TooltipAvatar.propTypes = {
  user: PropTypes.object.isRequired,
};

export default TooltipAvatar;
