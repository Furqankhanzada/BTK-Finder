import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as actionTypes from './actionTypes';
import {
  SIGNUP,
  LOGIN,
  EDIT_PROFILE,
  GET_PROFILE,
  UPLOAD,
  RESET_PASSWORD,
  VERIFY_CODE,
  CHANGE_PASSWORD,
} from '../constants';
import {
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
  LOGIN_API_ERROR,
  LOGIN_API_SUCCESS,
  SIGNOUT,
  GET_PROFILE_API_SUCCESS,
  GET_PROFILE_API_ERROR,
  EDIT_PROFILE_API,
  EDIT_PROFILE_API_SUCCESS,
  EDIT_PROFILE_API_ERROR,
  PROFILE_UPLOAD_API,
  LOGGED_IN_SUCCESS,
  RESET_PASSWORD_API,
  VERIFY_CODE_API,
  CHANGE_PASSWORD_API,
} from '../constants/auth';
import { handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';

const onLogin = data => {
  return {
    type: actionTypes.LOGIN,
    data,
  };
};

export const authentication = (login, callback) => dispatch => {
  dispatch({ type: SIGNOUT, loading: true });
  setTimeout(() => {
    let data = {
      success: login,
    };
    dispatch(onLogin(data));
    dispatch({ type: SIGNOUT, loading: false });
    AsyncStorage.removeItem('access_token');
    if (typeof callback === 'function') {
      callback({ success: true });
    }
  }, 500);
};

export const register = (user, cb) => {
  return dispatch => {
    axios({
      method: 'POST',
      url: SIGNUP,
      data: user,
    })
      .then(response => {
        dispatch({ type: REGISTER_API_SUCCESS, user: response.data });
        cb && cb();
      })
      .catch(error => {
        dispatch({ type: REGISTER_API_ERROR, error });
        cb && cb(error);
        handleError(error);
      });
  };
};

export const login = (user, cb) => {
  return dispatch => {
    axios({
      method: 'POST',
      url: LOGIN,
      data: user,
    })
      .then(async response => {
        dispatch({ type: LOGIN_API_SUCCESS, user: response.data });
        dispatch(getProfile());
        cb && cb();
        try {
          await AsyncStorage.setItem(
            'access_token',
            response.data.access_token,
          );
        } catch (e) {
          // saving error
        }
      })
      .catch(({ response }) => {
        dispatch({ type: LOGIN_API_ERROR, response });
        cb && cb(response);
        handleError(response.data);
      });
  };
};

export const getProfile = cb => {
  return async dispatch => {
    axiosApiInstance({
      method: 'GET',
      url: GET_PROFILE,
    })
      .then(response => {
        dispatch({
          type: GET_PROFILE_API_SUCCESS,
          profile: response.data,
        });
        cb && cb();
      })
      .catch(error => {
        dispatch({ type: GET_PROFILE_API_ERROR, error });
        cb && cb(error);
        handleError(error);
      });
  };
};

export const editProfile = (payload, cb) => {
  return async dispatch => {
    dispatch({ type: EDIT_PROFILE_API, loading: true });
    axiosApiInstance({
      method: 'PUT',
      url: EDIT_PROFILE + payload._id,
      data: payload,
    })
      .then(response => {
        dispatch({
          type: EDIT_PROFILE_API_SUCCESS,
          user: payload,
          loading: false,
        });
        cb && cb();
      })
      .catch(error => {
        dispatch({ type: EDIT_PROFILE_API_ERROR, error, loading: false });
        cb && cb(error);
        handleError(error);
      });
  };
};

export const uploadProfileImage = (payload, form, cb) => dispatch => {
  dispatch({ type: PROFILE_UPLOAD_API, loading: true });
  axiosApiInstance
    .post(`${UPLOAD}/${payload._id}/profile`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(response => {
      dispatch({ type: PROFILE_UPLOAD_API, loading: false });
      dispatch(
        editProfile({ ...payload, avatar: response.data.Location }, () => cb()),
      );
    })
    .catch(error => {
      dispatch({ type: PROFILE_UPLOAD_API, loading: false });
      cb && cb(error);
      handleError(error);
    });
};

export const setIsLogin = () => dispatch => {
  AsyncStorage.getItem('access_token').then(token => {
    if (token) {
      dispatch({ type: LOGGED_IN_SUCCESS });
    }
  });
};

export const resetPassword = (payload, cb) => dispatch => {
  dispatch({ type: RESET_PASSWORD_API, loading: true });
  axiosApiInstance({
    method: 'POST',
    url: RESET_PASSWORD,
    data: payload,
  })
    .then(response => {
      dispatch({ type: RESET_PASSWORD_API, loading: false });
      Toast.show({
        type: 'success',
        topOffset: 55,
        text1: 'Code Sent',
        text2: 'A verification code is sent on your provided email/phone',
      });
      cb() && cb();
    })
    .catch(({ response }) => {
      dispatch({ type: RESET_PASSWORD_API, loading: false });
      handleError(response.data);
    });
};

export const verifyCode = (payload, cb) => dispatch => {
  dispatch({ type: VERIFY_CODE_API, loading: true });
  axiosApiInstance({
    method: 'POST',
    url: VERIFY_CODE,
    data: payload,
  })
    .then(async response => {
      dispatch({ type: VERIFY_CODE_API, loading: false });
      try {
        await AsyncStorage.setItem('access_token', response.data.access_token);
      } catch (e) {
        // saving error
      }
      cb() && cb();
    })
    .catch(({ response }) => {
      dispatch({ type: VERIFY_CODE_API, loading: false });
      handleError(response.data);
    });
};

export const changePassword = (payload, cb) => dispatch => {
  dispatch({ type: CHANGE_PASSWORD_API, loading: true });
  axiosApiInstance({
    method: 'POST',
    url: CHANGE_PASSWORD,
    data: payload,
  })
    .then(response => {
      dispatch({ type: CHANGE_PASSWORD_API, loading: false });
      Toast.show({
        type: 'success',
        topOffset: 55,
        text1: 'Password Changed',
        text2: 'You have successfully changed your password',
      });
      dispatch({ type: LOGIN_API_SUCCESS });
      dispatch(getProfile());
      cb() && cb();
    })
    .catch(({ response }) => {
      dispatch({ type: CHANGE_PASSWORD_API, loading: false });
      handleError(response.data);
    });
};
