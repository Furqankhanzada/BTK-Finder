import axios from 'axios';
import Toast from 'react-native-toast-message';
import * as actionTypes from './actionTypes';
import { SIGNUP } from '../constants';
import { REGISTER_API_ERROR, REGISTER_API_SUCCESS } from '../constants/auth';

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
      method: 'post',
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

        if (error.response && error.response.data) {
          console.log('error###', error.response.data);

          Toast.show({
            type: 'error',
            topOffset: 55,
            text1: error.response.data.error,
            text2: error.response.data.message.join('\n'),
          });
        }
      });
  };
};
