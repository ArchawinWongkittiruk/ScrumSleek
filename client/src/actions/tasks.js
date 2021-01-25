import axios from 'axios';
import { ADD_TASK, PROJECT_ERROR } from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add task to backlog
export const addTask = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post('/api/tasks', body, config);

    dispatch({
      type: ADD_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
