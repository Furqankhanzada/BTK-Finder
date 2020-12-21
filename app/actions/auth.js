import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as actionTypes from './actionTypes';
import { SIGNUP, LOGIN, EDIT_PROFILE, GET_PROFILE, UPLOAD } from '../constants';
import {
  REGISTER_API_ERROR,
  REGISTER_API_SUCCESS,
  LOGIN_API_ERROR,
  LOGIN_API_SUCCESS,
  GET_PROFILE_API_SUCCESS,
  GET_PROFILE_API_ERROR,
  EDIT_PROFILE_API_SUCCESS,
  EDIT_PROFILE_API_ERROR,
  PROFILE_UPLOAD_API,
} from '../constants/auth';
import { handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';

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
      .catch(({ response }) => {
        dispatch({ type: LOGIN_API_ERROR, response });
        cb && cb(response);
        handleError(response.data);
      });
  };
};

export const getProfile = (cb) => {
  return async (dispatch) => {
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

export const editProfile = (payload, cb) => {
  return async (dispatch) => {
    axiosApiInstance({
      method: 'PUT',
      url: EDIT_PROFILE + payload._id,
      data: payload,
    })
      .then((response) => {
        dispatch({
          type: EDIT_PROFILE_API_SUCCESS,
          user: payload,
        });
        cb && cb();
      })
      .catch((error) => {
        dispatch({ type: EDIT_PROFILE_API_ERROR, error });
        cb && cb(error);
        handleError(error);
        console.log('###### EDIT PROFILE API ERROR', error);
      });
  };
};

export const uploadProfileImage = (payload, form, cb) => (dispatch) => {
  dispatch({ type: PROFILE_UPLOAD_API, loading: true });
  axiosApiInstance.post(`${UPLOAD}/${payload._id}/profile`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        dispatch({ type: PROFILE_UPLOAD_API, loading: false });
        dispatch(editProfile({...payload, avatar: response.data.Location}, () => cb()));
      })
      .catch((error) => {
        dispatch({ type: PROFILE_UPLOAD_API, loading: false });
        cb && cb(error);
        handleError(error);
      });
};
