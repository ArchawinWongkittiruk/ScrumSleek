import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import project from './project';
import forms from './forms';

export default combineReducers({ alert, auth, project, forms });
