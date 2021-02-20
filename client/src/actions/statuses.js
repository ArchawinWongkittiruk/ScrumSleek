import axios from 'axios';
import {
  ADD_STATUS,
  PROJECT_ERROR,
  EDIT_STATUS,
  MOVE_STATUS,
  CHANGE_STATUS_COLOR,
  DELETE_STATUS,
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

    const res = await axios.post('/api/statuses', body, config);

    dispatch({
      type: ADD_STATUS,
      payload: res.data,
    });
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

    const res = await axios.patch(`/api/statuses/edit/${statusId}`, body, config);

    dispatch({
      type: EDIT_STATUS,
      payload: res.data,
    });
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

    const res = await axios.patch(`/api/statuses/move/${statusId}`, body, config);

    dispatch({
      type: MOVE_STATUS,
      payload: res.data,
    });
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

    const res = await axios.patch(`/api/statuses/color/${statusId}`, body, config);

    dispatch({
      type: CHANGE_STATUS_COLOR,
      payload: res.data,
    });
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
    const res = await axios.delete(`/api/statuses/${statusId}`);

    dispatch({
      type: DELETE_STATUS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
