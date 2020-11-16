import {
    GET_PROFILE_API_SUCCESS,
    GET_PROFILE_API_ERROR,
  } from '../constants/profile';
  
  //initial state.
  const initialState = {
    all: [],
  };
  
  export default function userReducer(state = initialState, action = {}) {
    switch (action.type) {
      case GET_PROFILE_API_SUCCESS:
        return Object.assign({}, state, { ...action.profile });
      case GET_PROFILE_API_ERROR:
        return Object.assign({}, state, action.error);
      default:
        return state;
    }
  }