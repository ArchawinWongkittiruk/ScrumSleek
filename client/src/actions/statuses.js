import axios from 'axios';
import {
  PROJECT_ERROR,
  // ADD_STATUS,
  // EDIT_STATUS,
  // MOVE_STATUS,
  // CHANGE_STATUS_COLOR,
  // DELETE_STATUS,
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add status
export const addStatus = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.post('/api/statuses', body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit status
export const editStatus = (statusId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.patch(`/api/statuses/edit/${statusId}`, body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Move status
export const moveStatus = (statusId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.patch(`/api/statuses/move/${statusId}`, body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Change status color
export const changeStatusColor = (statusId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    await axios.patch(`/api/statuses/color/${statusId}`, body, config);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete status
export const deleteStatus = (statusId) => async (dispatch) => {
  try {
    await axios.delete(`/api/statuses/${statusId}`);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
