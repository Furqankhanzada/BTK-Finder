import { GET_PROFILE } from '../constants';
import {
    GET_PROFILE_API_SUCCESS,
    GET_PROFILE_API_ERROR,
} from '../constants/profile';
import { handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';

export const getProfile = (cb) => {
  return async (dispatch)  => {
    axiosApiInstance({
      method: 'GET',
      url: GET_PROFILE,
    })
      .then((response) => {
        dispatch({
          type: GET_PROFILE_API_SUCCESS,
            profile: response.data,
        });
        cb && cb();
      })
      .catch((error) => {
        dispatch({ type: GET_PROFILE_API_ERROR, error });
        cb && cb(error);
        handleError(error);
        console.log('###### PROFILE API ERROR', error);
      });
  };
};
