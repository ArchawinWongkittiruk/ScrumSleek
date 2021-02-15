import {
  CLEAR_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  PROJECT_ERROR,
  RENAME_PROJECT,
  ADD_MEMBER,
  DELETE_PROJECT,
  ADD_TASK,
  EDIT_TASK,
  MOVE_TASK,
  CHANGE_TASK_STATUS,
  DELETE_TASK,
  START_SPRINT,
  END_SPRINT,
} from '../actions/types';

const initialState = {
  projects: [],
  project: null,
  projectsLoading: true,
  error: {},
};

export default function Project(state = initialState, action) {
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
        project: payload,
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
    case ADD_MEMBER:
      return {
        ...state,
        project: {
          ...state.project,
          members: payload,
        },
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== payload),
      };
    case ADD_TASK:
      return {
        ...state,
        project: { ...state.project, tasks: [...state.project.tasks, payload] },
      };
    case EDIT_TASK:
    case MOVE_TASK:
    case CHANGE_TASK_STATUS:
      return {
        ...state,
        project: {
          ...state.project,
          tasks: state.project.tasks.map((task) => (task._id === payload._id ? payload : task)),
        },
      };
    case DELETE_TASK:
      return {
        ...state,
        project: {
          ...state.project,
          tasks: state.project.tasks.filter((task) => task._id !== payload),
        },
      };
    case START_SPRINT:
    case END_SPRINT:
      return {
        ...state,
        project: payload,
      };
    default:
      return state;
  }
}
