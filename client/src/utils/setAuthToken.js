// from https://github.com/bradtraversy/devconnector_2.0/blob/master/client/src/utils/setAuthToken.js

import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
