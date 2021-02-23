import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Avatar } from '@chakra-ui/react';

const getInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

const TooltipAvatar = ({ member, ...props }) => {
  const { name, avatar } = member;

  return name ? (
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
  ) : (
    <Avatar />
  );
};

TooltipAvatar.propTypes = {
  member: PropTypes.object.isRequired,
};

export default TooltipAvatar;
