import React from 'react';
import { Tooltip, Avatar } from '@chakra-ui/react';

const TooltipAvatar = (props) => (
  <Tooltip hasArrow label={props.name}>
    <Avatar {...props} />
  </Tooltip>
);

export default TooltipAvatar;
