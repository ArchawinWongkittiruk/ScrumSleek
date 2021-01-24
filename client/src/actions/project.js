import axios from 'axios';
// import { setAlert } from './alert';
import {
  CLEAR_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  PROJECT_ERROR,
  RENAME_PROJECT,
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get projects
export const getProjects = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_PROJECT });

    const res = await axios.get('/api/projects');

    dispatch({
      type: GET_PROJECTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get project
export const getProject = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/projects/${id}`);

    if (res) {
      axios.defaults.headers.common['projectId'] = id;
    } else {
      delete axios.defaults.headers.common['projectId'];
    }

    dispatch({
      type: GET_PROJECT,
      payload: { ...res.data, listObjects: [], cardObjects: [] },
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add project
export const addProject = (formData, history) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post('/api/projects', body, config);

    dispatch({
      type: ADD_PROJECT,
      payload: res.data,
    });

    // dispatch(setAlert('Project Created', 'success'));

    history.push(`/project/${res.data._id}`);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Rename project
export const renameProject = (projectId, formData) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/projects/rename/${projectId}`, formData, config);

    dispatch({
      type: RENAME_PROJECT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
