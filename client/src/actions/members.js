import axios from 'axios';
import { CLEAR_PROJECT, PROJECT_ERROR, ADD_MEMBER, LEAVE_PROJECT } from './types';

// const config = {
//   headers: {
//     'Content-Type': 'application/json',
//   },
// };

// Add member
export const addMember = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/members/addMember/${userId}`);

    dispatch({
      type: ADD_MEMBER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Leave project
export const leaveProject = (userId, history) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/members/leave/${userId}`);

    dispatch({
      type: LEAVE_PROJECT,
      payload: res.data,
    });

    dispatch({ type: CLEAR_PROJECT });

    history.push('/projects');
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
