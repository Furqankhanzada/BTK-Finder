import {
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    GET_BUSINESSES_API_SUCCESS,
    GET_BUSINESSES_API_ERROR,
} from '../constants/business';

//initial state.
const initialState = {
    all: [],
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_BUSINESS_API_SUCCESS:
      return Object.assign({}, state, action.businesses);
    case CREATE_BUSINESS_API_ERROR:
      return Object.assign({}, state, action.error);
    case GET_BUSINESSES_API_SUCCESS:
      return Object.assign({}, state, action.businesses);
    case GET_BUSINESSES_API_ERROR:
      return Object.assign({}, state, action.error);
    default:
      return state;
  }
}
