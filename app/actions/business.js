import {
  CREATE_BUSINESS,
  GET_BUSINESSES,
  GET_SINGLE_BUSINESS,
} from '../constants';
import {
    CREATE_BUSINESS_API,
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    SET_BUSINESS_FORM_DATA_IN_REDUX,
    GET_POPULAR_BUSINESSES_API,
    GET_RECENTLY_ADDED_BUSINESSES_API,
    GET_ALL_BUSINESSES_API,
    GET_SINGLE_BUSINESS_API
} from '../constants/business';
import { handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';
import Toast from 'react-native-toast-message';
import axios from 'axios';

export const createBusiness = (payload, cb) => (dispatch) => {
  dispatch({ type: CREATE_BUSINESS_API });
  axiosApiInstance({
    method: 'POST',
    url: CREATE_BUSINESS,
    data: payload,
  })
    .then((response) => {
      dispatch({ type: CREATE_BUSINESS_API_SUCCESS });
      Toast.show({
        type: 'success',
        topOffset: 55,
        text1: 'Successfully',
        text2: 'Successfully added business!',
      });
      cb && cb();
    })
    .catch(({ response }) => {
      dispatch({ type: CREATE_BUSINESS_API_ERROR });
      handleError({ message: response.data.message[0] });
    });
};

const encodeQueryData = (data) => {
  const ret = [];
  for (const d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
};

export const getBusinesses = (payload) => (dispatch) => {
  let dispatchType;
  if (payload.popular) {
    dispatchType = GET_POPULAR_BUSINESSES_API;
  } else {
    dispatchType = GET_RECENTLY_ADDED_BUSINESSES_API;
  }
  let queryParams = encodeQueryData(payload)
    ? `?${encodeQueryData(payload)}`
    : '';

  dispatch({ type: dispatchType, loading: true });

  axiosApiInstance({ method: 'GET', url: `${GET_BUSINESSES}${queryParams}` })
    .then((response) => {
      dispatch({ type: dispatchType, loading: false, data: response.data });
    })
    .catch((error) => {
      dispatch({ type: dispatchType, loading: false });
      handleError(error);
    });
};

export const getAllBusinesses = (payload) => (dispatch)  => {

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    dispatch({type: GET_ALL_BUSINESSES_API, loading: true});

    axiosApiInstance({method: 'GET', url: `${GET_BUSINESSES}${queryParams}`})
        .then((response) => {
            dispatch({type: GET_ALL_BUSINESSES_API, loading: false, data: response.data});
        })
        .catch((error) => {
            dispatch({ type: GET_ALL_BUSINESSES_API, loading: false });
            handleError(error);
        });
};

export const setBusinessFormData = (businessFormData) => {
  return async (dispatch) => {
    dispatch({ type: SET_BUSINESS_FORM_DATA_IN_REDUX, businessFormData });
  };
};

export const getSingleBusiness = () => {
  return (dispatch) => {
    axios({ method: 'GET', url: GET_SINGLE_BUSINESS })
      .then((response) => {
        dispatch({
          type: GET_SINGLE_BUSINESS_API,
          loading: false,
          data: response.data,
        });
      })
      .catch((error) => {
        dispatch({ type: GET_SINGLE_BUSINESS_API, loading: false });
        handleError(error);
      });
  };
};
