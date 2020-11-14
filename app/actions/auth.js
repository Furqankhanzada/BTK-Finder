import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as actionTypes from './actionTypes';
import { SIGNUP, LOGIN } from '../constants';
import {
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
  LOGIN_API_ERROR,
  LOGIN_API_SUCCESS,
} from '../constants/auth';
import { handleError } from '../utils';

const onLogin = (data) => {
  return {
    type: actionTypes.LOGIN,
    data,
  };
};

export const authentication = (login, callback) => (dispatch) => {
  //call api and dispatch action case
  setTimeout(() => {
    let data = {
      success: login,
    };
    dispatch(onLogin(data));
    if (typeof callback === 'function') {
      callback({ success: true });
    }
  }, 500);
};

export const register = (user, cb) => {
  return (dispatch) => {
    axios({
      method: 'POST',
      url: SIGNUP,
      data: user,
    })
      .then((response) => {
        dispatch({ type: REGISTER_API_SUCCESS, user: response.data });
        cb && cb();
      })
      .catch((error) => {
        dispatch({ type: REGISTER_API_ERROR, error });
        cb && cb(error);
        handleError(error);
      });
  };
};

export const login = (user, cb) => {
  return (dispatch) => {
    axios({
      method: 'POST',
      url: LOGIN,
      data: user,
    })
      .then(async (response) => {
        dispatch({ type: LOGIN_API_SUCCESS, user: response.data });
        cb && cb();
        console.log('Token:', response.data);
        try {
          await AsyncStorage.setItem(
            'access_token',
            response.data.access_token,
          );
          const token = await AsyncStorage.getItem('access_token');
          console.log('token#######', token);
        } catch (e) {
          // saving error
        }
      })
      .catch((error) => {
        dispatch({ type: LOGIN_API_ERROR, error });
        cb && cb(error);
        handleError(error);
      });
  };
};
