import axios from 'axios';
import {
  PROJECT_ERROR,
  // ADD_TASK,
  // EDIT_TASK,
  // MOVE_TASK,
  // CHANGE_TASK_STATUS,
  // CHANGE_TASK_STORY_POINTS,
  // SET_TASK_MEMBER,
  // DELETE_TASK,
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add task to backlog
export const addTask = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.post('/api/tasks', body, config);
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

    await axios.patch(`/api/tasks/edit/${taskId}`, body, config);
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

    await axios.patch(`/api/tasks/move/${taskId}`, body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Change task status
export const changeTaskStatus = (taskId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.patch(`/api/tasks/status/${taskId}`, body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Change task story points estimate
export const changeTaskStoryPoints = (taskId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.patch(`/api/tasks/storyPoints/${taskId}`, body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add/remove task member
export const setTaskMember = (formData) => async (dispatch) => {
  try {
    const { add, taskId, userId } = formData;

    await axios.put(`/api/tasks/setMember/${add}/${taskId}/${userId}`);
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
    await axios.delete(`/api/tasks/${taskId}`);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
