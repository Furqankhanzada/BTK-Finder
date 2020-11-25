import * as actionTypes from '@actions/actionTypes';
import {
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
  LOGIN_API_ERROR,
  LOGIN_API_SUCCESS,
} from '../constants/auth';

//initial state.
const initialState = {
  login: {
    success: false,
  },
  user: {},
  isLogin: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        login: action.data,
      };
    case REGISTER_API_SUCCESS:
      return Object.assign({}, state, action.user);
    case REGISTER_API_ERROR:
      return Object.assign({}, state, action.error);
    case LOGIN_API_SUCCESS:
      return Object.assign({}, state, action.user, {isLogin: true});
    case LOGIN_API_ERROR:
      return Object.assign({}, state, action.error);
    default:
      return state;
  }
}
