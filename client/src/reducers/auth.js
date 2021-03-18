import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  VERIFY_USER,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  EDIT_USER,
  CAN_GET_PROJECT,
  SET_SIGNUP_LOADING,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  loading: true,
  signupLoading: false,
  user: null,
  canGetProject: false,
};

export default function Auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case VERIFY_USER:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
        loading: false,
      };
    case SET_SIGNUP_LOADING:
      return {
        ...state,
        signupLoading: payload,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        loading: false,
        user: null,
      };
    case EDIT_USER:
      return {
        ...state,
        user: payload,
      };
    case CAN_GET_PROJECT:
      return {
        ...state,
        canGetProject: true,
      };
    default:
      return state;
  }
}
