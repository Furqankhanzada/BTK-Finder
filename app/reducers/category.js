import {
  GET_CATEGORIES_API_SUCCESS,
  GET_CATEGORIES_API_ERROR,
} from '../constants/category';

//initial state.
const initialState = {
  all: [],
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_CATEGORIES_API_SUCCESS:
      return Object.assign({}, state, { all: action.categories });
    case GET_CATEGORIES_API_ERROR:
      return Object.assign({}, state, action.error);
    default:
      return state;
  }
}
