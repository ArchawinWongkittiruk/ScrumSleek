import {
  CLEAR_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  PROJECT_ERROR,
  RENAME_PROJECT,
  ADD_TASK,
  EDIT_TASK,
  START_SPRINT,
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
    case ADD_TASK:
      return {
        ...state,
        project: { ...state.project, backlog: [...state.project.backlog, payload] },
      };
    case EDIT_TASK:
      return {
        ...state,
        project: {
          ...state.project,
          backlog: state.project.backlog.map((task) => (task._id === payload._id ? payload : task)),
          sprint: {
            ...state.project.sprint,
            tasks: state.project.sprint.tasks.map((task) =>
              task._id === payload._id ? payload : task
            ),
          },
        },
      };
    case START_SPRINT:
      return {
        ...state,
        project: {
          ...state.project,
          sprint: payload,
        },
      };
    default:
      return state;
  }
}
