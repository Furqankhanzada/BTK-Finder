import axios from 'axios';
import * as actionTypes from './actionTypes';
import { SIGNUP } from '../constants';
import {
  REGISTER_API,
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
} from '../constants/auth';

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

export const register = (user) => {
  return (dispatch) => {
    dispatch({ type: REGISTER_API });
    axios({
      method: 'post',
      url: SIGNUP,
      data: user,
    })
      .then((response) => {
        dispatch({ type: REGISTER_API_SUCCESS, user: response.data });
      })
      .catch(function (error) {
        dispatch({ type: REGISTER_API_ERROR, error });
      });
  };
};
