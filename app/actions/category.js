import axios from 'axios';
import { GET_CATEGORIES } from '../constants';
import {
  GET_CATEGORIES_API_SUCCESS,
  GET_CATEGORIES_API_ERROR,
} from '../constants/category';
import { handleError } from '../utils';

export const getCategories = (options, cb) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: GET_CATEGORIES,
      params: options,
    })
      .then((response) => {
        dispatch({
          type: GET_CATEGORIES_API_SUCCESS,
          categories: response.data,
        });
        cb && cb();
      })
      .catch((error) => {
        dispatch({ type: GET_CATEGORIES_API_ERROR, error });
        cb && cb(error);
        handleError(error);
      });
  };
};
