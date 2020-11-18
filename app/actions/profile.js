import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_PROFILE } from '../constants';
import {
    GET_PROFILE_API_SUCCESS,
    GET_PROFILE_API_ERROR,
} from '../constants/profile';
import { handleError } from '../utils';

export const getProfile = (cb) => {
  return async (dispatch)  => {
    const token = await AsyncStorage.getItem('access_token')
    axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
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
