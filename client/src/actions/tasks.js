import axios from 'axios';
import { ADD_TASK, PROJECT_ERROR, EDIT_TASK, MOVE_TASK, DELETE_TASK } from './types';

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

// Edit task
export const editTask = (taskId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.patch(`/api/tasks/edit/${taskId}`, body, config);

    dispatch({
      type: EDIT_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Move task
export const moveTask = (taskId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.patch(`/api/tasks/move/${taskId}`, body, config);

    dispatch({
      type: MOVE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete task
export const deleteTask = (taskId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/tasks/${taskId}`);

    dispatch({
      type: DELETE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
