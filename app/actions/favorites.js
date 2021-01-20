import {
  GET_FAVORITES_API,
  GET_FAVORITES_API_SUCCESS,
  GET_FAVORITES_API_ERROR,
  ADD_FAVORITE_API,
  REMOVE_FAVORITE_API,
} from '../constants/favorites';
import { BUSINESSES_API } from '../constants';
import { handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';

const encodeQueryData = (data) => {
  const ret = [];
  for (const d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
};

export const getFavoriteBusinesses = (payload) => (dispatch) => {
  dispatch({ type: GET_FAVORITES_API, loading: true });
  let queryParams = encodeQueryData(payload)
    ? `?${encodeQueryData(payload)}`
    : '';
  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}${queryParams}` })
    .then((response) => {
      dispatch({
        type: GET_FAVORITES_API_SUCCESS,
        loading: false,
        data: response.data || [],
      });
    })
    .catch(({ response }) => {
      dispatch({
        type: GET_FAVORITES_API_ERROR,
        loading: false,
        data: [],
      });
      handleError(response.data);
    });
};

export const addFavoriteBusiness = (id) => (dispatch) => {
  dispatch({ type: ADD_FAVORITE_API, loading: true });
  axiosApiInstance({ method: 'POST', url: `${BUSINESSES_API}/${id}/favorite` })
    .then((response) => {
      dispatch(
        getFavoriteBusinesses({
          favorite: true,
          skip: 0,
          fields: 'name, thumbnail, category, averageRatings',
        }),
      );
      dispatch({ type: ADD_FAVORITE_API, loading: false });
    })
    .catch(({ response }) => {
      dispatch({ type: ADD_FAVORITE_API, loading: false });
      handleError(response.data);
    });
};

export const removeFavoriteBusiness = (id) => (dispatch) => {
  dispatch({ type: REMOVE_FAVORITE_API, loading: true });
  axiosApiInstance({
    method: 'DELETE',
    url: `${BUSINESSES_API}/${id}/favorite`,
  })
    .then((response) => {
      dispatch(
        getFavoriteBusinesses({
          favorite: true,
          skip: 0,
          fields: 'name, thumbnail, category, averageRatings',
        }),
      );
      dispatch({ type: REMOVE_FAVORITE_API, loading: false });
    })
    .catch(({ response }) => {
      dispatch({ type: REMOVE_FAVORITE_API, loading: false });
      handleError(response.data);
    });
};
