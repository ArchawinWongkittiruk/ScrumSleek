import {
  CLEAR_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  PROJECT_ERROR,
  RENAME_PROJECT,
} from '../actions/types';

const initialState = {
  projects: [],
  project: null,
  projectsLoading: true,
  error: {},
};

const project = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CLEAR_PROJECT:
      return {
        ...state,
        project: null,
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        projectsLoading: false,
      };
    case GET_PROJECT:
    case RENAME_PROJECT:
      return {
        ...state,
        project: { ...state.project, ...payload },
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [payload, ...state.projects],
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};

export default project;
