import axios from 'axios';
import { GET_PROFILE } from '../constants';
import {
    GET_PROFILE_API_SUCCESS,
    GET_PROFILE_API_ERROR,
} from '../constants/profile';
import { handleError } from '../utils';

export const getProfile = (cb) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbE9yTnVtYmVyIjoiYnRrLWV4cGxvcmVAZ21haWwuY29tIiwic3ViIjoiNWZiMjI1NTI1ZTQ2ZWQyNjNkODFjNWQ5IiwiaWF0IjoxNjA1NTE4MzE4LCJleHAiOjE2MzcwNzU5MTh9.YCNRg74Lts_0EPjc8qHy4rMb8ViJQc8D-8zBOjnAtjI` },
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
