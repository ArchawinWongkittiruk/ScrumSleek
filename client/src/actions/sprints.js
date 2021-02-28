import axios from 'axios';
import {
  PROJECT_ERROR,
  START_SPRINT,
  END_SPRINT,
  EDIT_REVIEW_RETROSPECTIVE,
  SET_VELOCITY_LIMITED,
  SET_VELOCITY_LIMIT,
} from './types';

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

// Edit sprint review and/or retrospective
export const editReviewRetrospective = (sprintId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.put(`/api/sprints/reviewRetrospective/${sprintId}`, body, config);

    dispatch({
      type: EDIT_REVIEW_RETROSPECTIVE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Set enforcement of velocity limit
export const setVelocityLimited = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.put('/api/sprints/velocityLimited', body, config);

    dispatch({
      type: SET_VELOCITY_LIMITED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Set velocity limit
export const setVelocityLimit = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.put('/api/sprints/velocityLimit', body, config);

    dispatch({
      type: SET_VELOCITY_LIMIT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
