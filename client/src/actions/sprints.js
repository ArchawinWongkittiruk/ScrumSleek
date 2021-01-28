import axios from 'axios';
import { PROJECT_ERROR, START_SPRINT, END_SPRINT } from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Start sprint
export const startSprint = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post('/api/sprints', body, config);

    dispatch({
      type: START_SPRINT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// End sprint
export const endSprint = () => async (dispatch) => {
  try {
    const res = await axios.post('/api/sprints/end');

    dispatch({
      type: END_SPRINT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
