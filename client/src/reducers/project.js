import {
  CLEAR_PROJECT,
  ADD_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  RENAME_PROJECT,
  PROJECT_ERROR,
  DELETE_PROJECT,
  ADD_TASK,
  EDIT_TASK,
  MOVE_TASK,
  CHANGE_TASK_STATUS,
  CHANGE_TASK_STORY_POINTS,
  SET_TASK_MEMBER,
  DELETE_TASK,
  START_SPRINT,
  END_SPRINT,
  EDIT_REVIEW_RETROSPECTIVE,
  SET_VELOCITY_LIMITED,
  SET_VELOCITY_LIMIT,
  ADD_STATUS,
  EDIT_STATUS,
  MOVE_STATUS,
  CHANGE_STATUS_COLOR,
  DELETE_STATUS,
  ADD_MEMBER,
  CHANGE_ROLE,
  LEAVE_PROJECT,
  REMOVE_MEMBER,
  // Socket Events
  SET_ACTIVE_MEMBERS,
  // Authorization
  SET_IS_MEMBER,
  SET_IS_ADMIN,
} from '../actions/types';

const initialState = {
  projects: [],
  project: null,
  projectsLoading: true,
  error: {},
  isMember: false,
  isAdmin: false,
};

export default function Project(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CLEAR_PROJECT:
      return {
        ...state,
        project: null,
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [payload, ...state.projects],
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
        projectsLoading: false,
      };
    case GET_PROJECT:
      return {
        ...state,
        project: payload,
      };
    case RENAME_PROJECT:
      return {
        ...state,
        project: { ...state.project, title: payload.title },
        projects: state.projects.map((project) =>
          project._id === payload._id ? { ...project, title: payload.title } : project
        ),
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
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
    case CHANGE_TASK_STATUS:
    case CHANGE_TASK_STORY_POINTS:
    case SET_TASK_MEMBER:
      return {
        ...state,
        project: {
          ...state.project,
          tasks: state.project.tasks.map((task) => (task._id === payload._id ? payload : task)),
        },
      };
    case MOVE_TASK:
      return {
        ...state,
        project: { ...state.project, tasks: payload },
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
        project: {
          ...state.project,
          ...payload,
        },
      };
    case EDIT_REVIEW_RETROSPECTIVE:
      return {
        ...state,
        project: {
          ...state.project,
          sprints: state.project.sprints.map((sprint) =>
            sprint._id === payload._id ? payload : sprint
          ),
        },
      };
    case SET_VELOCITY_LIMITED:
      return {
        ...state,
        project: {
          ...state.project,
          velocityLimited: payload,
        },
      };
    case SET_VELOCITY_LIMIT:
      return {
        ...state,
        project: {
          ...state.project,
          velocityLimit: payload,
        },
      };
    case ADD_STATUS:
      return {
        ...state,
        project: { ...state.project, statuses: payload },
      };
    case EDIT_STATUS:
    case CHANGE_STATUS_COLOR:
      return {
        ...state,
        project: {
          ...state.project,
          statuses: state.project.statuses.map((status) =>
            status._id === payload._id ? payload : status
          ),
        },
      };
    case MOVE_STATUS:
      return {
        ...state,
        project: { ...state.project, statuses: payload },
      };
    case DELETE_STATUS:
      return {
        ...state,
        project: {
          ...state.project,
          ...payload,
        },
      };
    case ADD_MEMBER:
      return {
        ...state,
        project: { ...state.project, members: [...state.project.members, payload] },
      };
    case CHANGE_ROLE:
      return {
        ...state,
        project: {
          ...state.project,
          members: state.project.members.map((projectMember) => ({
            ...payload.find((member) => member.user._id === projectMember.user._id),
            active: projectMember.active,
          })),
        },
      };
    case LEAVE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== payload),
      };
    case REMOVE_MEMBER:
      return {
        ...state,
        project: {
          ...state.project,
          tasks: payload.tasks,
          members: state.project.members.filter((member) => member.user._id !== payload.memberId),
        },
      };
    // Socket Events
    case SET_ACTIVE_MEMBERS:
      if (state.project) {
        return {
          ...state,
          project: {
            ...state.project,
            members: state.project.members.map((member) =>
              payload.includes(member.user._id)
                ? { ...member, active: true }
                : { ...member, active: false }
            ),
          },
        };
      } else {
        return state;
      }
    // Authorization
    case SET_IS_MEMBER:
      return {
        ...state,
        isMember: payload,
      };
    case SET_IS_ADMIN:
      return {
        ...state,
        isAdmin: payload,
      };
    default:
      return state;
  }
}
