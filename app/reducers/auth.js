import * as actionTypes from '@actions/actionTypes';
import {
  REGISTER_API,
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
} from '../constants/auth';

//initial state.
const initialState = {
  login: {
    success: false,
  },
  user: {},
  loading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        login: action.data,
      };
    case REGISTER_API:
      return Object.assign({}, state, { loading: true });
    case REGISTER_API_SUCCESS:
      return Object.assign({}, state, { loading: false }, action.user);
    case REGISTER_API_ERROR:
      return Object.assign({}, state, { loading: false });
    default:
      return state;
  }
}
