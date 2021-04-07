// loadUser, register, login, and logout based on https://github.com/bradtraversy/devconnector_2.0/blob/master/client/src/actions/auth.js

import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_SIGNUP_LOADING,
  VERIFY_USER,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  EDIT_USER,
} from './types';
import setAuthToken from '../utils/setAuthToken';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  } finally {
    dispatch({ type: SET_SIGNUP_LOADING, payload: false });
  }
};

// Resend verification token
export const resendVerify = (user) => async (dispatch) => {
  const body = JSON.stringify(user);

  try {
    const res = await axios.post('/api/users/resendVerify', body, config);

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Verify User
export const verifyUser = (token) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/users/verify/${token}`);

    dispatch({
      type: VERIFY_USER,
      payload: res.data,
    });

    dispatch(loadUser());

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
};

// Edit user name/avatar
export const editUser = (userId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.put(`/api/users/${userId}`, body, config);

    dispatch({
      type: EDIT_USER,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Send password reset
export const sendPasswordReset = (email) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/users/sendResetPassword/${email}`);

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

// Reset password
export const resetPassword = (token, { password }) => async (dispatch) => {
  const body = JSON.stringify({ password });

  try {
    const res = await axios.post(`/api/users/resetPassword/${token}`, body, config);

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

// Delete user
export const deleteUser = (userId, history) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/users/${userId}`);

    dispatch(logout());

    dispatch(setAlert(res.data.msg, 'success'));

    history.push('/');
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
