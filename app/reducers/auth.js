import * as actionTypes from '@actions/actionTypes';
import {
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
  LOGIN_API_ERROR,
  LOGIN_API_SUCCESS,
  LOGGED_IN_SUCCESS,
  SIGNOUT,
  GET_PROFILE_API_SUCCESS,
  GET_PROFILE_API_ERROR,
  EDIT_PROFILE_API,
  EDIT_PROFILE_API_SUCCESS,
  EDIT_PROFILE_API_ERROR,
  PROFILE_UPLOAD_API,
} from '../constants/auth';

//initial state.
const initialState = {
  login: {
    success: false,
  },
  user: {},
  isLogin: false,
  form: {},
  editProfileLoading: false,
  profileImageLoading: false,
  signOutLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        login: action.data,
      };
    case LOGGED_IN_SUCCESS:
      return Object.assign({}, state, { isLogin: true });
    case REGISTER_API_SUCCESS:
      return Object.assign({}, state, action.user);
    case REGISTER_API_ERROR:
      return Object.assign({}, state, action.error);
    case LOGIN_API_SUCCESS:
      return Object.assign({}, state, action.user, { isLogin: true });
    case LOGIN_API_ERROR:
      return Object.assign({}, state, action.error);
    case SIGNOUT:
      return Object.assign({}, state, { signOutLoading: action.loading });
    case GET_PROFILE_API_SUCCESS:
      return Object.assign({}, state, { ...action.profile });
    case GET_PROFILE_API_ERROR:
      return Object.assign({}, state, action.error);
    case EDIT_PROFILE_API:
      return Object.assign({}, state, { editProfileLoading: action.loading });
    case EDIT_PROFILE_API_SUCCESS:
      return Object.assign({}, state, action.user, {
        editProfileLoading: action.loading,
      });
    case EDIT_PROFILE_API_ERROR:
      return Object.assign({}, state, action.error, {
        editProfileLoading: action.loading,
      });
    case PROFILE_UPLOAD_API:
      return Object.assign({}, state, { profileImageLoading: action.loading });
    default:
      return state;
  }
}
