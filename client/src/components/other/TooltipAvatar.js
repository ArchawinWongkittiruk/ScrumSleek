import React from 'react';
import { Tooltip, Avatar } from '@chakra-ui/react';

const TooltipAvatar = (props) => (
  <Tooltip hasArrow label={props.name}>
    <Avatar bg='gray.300' color='gray.700' cursor='default' {...props} />
  </Tooltip>
);

export default TooltipAvatar;
