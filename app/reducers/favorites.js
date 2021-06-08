import {
  GET_FAVORITES_API,
  GET_FAVORITES_API_SUCCESS,
  GET_FAVORITES_API_ERROR,
  ADD_FAVORITE_API,
  REMOVE_FAVORITE_API,
  CLEAR_FAVORITES_IN_REDUX,
} from '../constants/favorites';

const initialState = {
  getFavoriteBusinesses: [],
  getFavoriteBusinessesLoading: false,
  isFavoriteLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_FAVORITES_API:
      return {
        ...state,
        getFavoriteBusinesses: state.getFavoriteBusinesses,
        getFavoriteBusinessesLoading: action.loading,
      };
    case GET_FAVORITES_API_SUCCESS:
      return {
        ...state,
        getFavoriteBusinesses: action.data,
        getFavoriteBusinessesLoading: action.loading,
      };
    case GET_FAVORITES_API_ERROR:
      return {
        ...state,
        getFavoriteBusinesses: action.data,
        getFavoriteBusinessesLoading: action.loading,
      };
    case ADD_FAVORITE_API:
      return {
        ...state,
        isFavoriteLoading: action.loading,
      };
    case REMOVE_FAVORITE_API:
      return {
        ...state,
        isFavoriteLoading: action.loading,
      };
    case CLEAR_FAVORITES_IN_REDUX:
      return {
        ...state,
        getFavoriteBusinesses: [],
      };
    default:
      return state;
  }
}
