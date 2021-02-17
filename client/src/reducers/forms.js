import {
  RESET_SPRINT_PLAN,
  SET_SPRINT_START,
  SET_SPRINT_END,
  SET_SPRINT_TARGET,
} from '../actions/types';

const initialState = {};

export default function Forms(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_SPRINT_PLAN:
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 7);
      const target = '';
      return { start, end, target };
    case SET_SPRINT_START:
      return { ...state, start: payload };
    case SET_SPRINT_END:
      return { ...state, end: payload };
    case SET_SPRINT_TARGET:
      return { ...state, target: payload };
    default:
      return state;
  }
}
