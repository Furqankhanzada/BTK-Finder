import { BUSINESSES_API } from '../constants';
import {
    CREATE_BUSINESS_API,
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    SET_BUSINESS_FORM_DATA_IN_REDUX,
    GET_POPULAR_BUSINESSES_API,
    GET_RECENTLY_ADDED_BUSINESSES_API,
    GET_ALL_BUSINESSES_API,
    GET_SINGLE_BUSINESS_API,
    LOAD_MORE_ALL_BUSINESSES_API,
    ADD_REVIEW_API,
    ADD_REVIEW_API_SUCCESS,
    ADD_REVIEW_API_ERROR,
} from '../constants/business';
import { handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';
import Toast from 'react-native-toast-message';

export const createBusiness = (payload, cb) => (dispatch) => {
  dispatch({ type: CREATE_BUSINESS_API });
  axiosApiInstance({
    method: 'POST',
    url: BUSINESSES_API,
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

  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}${queryParams}` })
    .then((response) => {
      dispatch({ type: dispatchType, loading: false, data: response.data });
    })
    .catch(({response}) => {
      dispatch({ type: dispatchType, loading: false });
      handleError(response.data);
    });
};

export const getAllBusinesses = (payload) => (dispatch)  => {
    let dispatchType = GET_ALL_BUSINESSES_API;
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    if(payload.skip > 0) dispatchType = LOAD_MORE_ALL_BUSINESSES_API;

    dispatch({
        type: dispatchType,
        loading: true,
        loadMoreLoading: true,
        data: []
    });

    axiosApiInstance({method: 'GET', url: `${BUSINESSES_API}${queryParams}`})
        .then((response) => {
            dispatch({
                type: dispatchType,
                loading: false,
                loadMoreLoading: false,
                data: response.data || [],
                isLoadMore: !(response.data && response.data.length < 10)
            });
        })
        .catch(({response}) => {
            dispatch({ type: dispatchType, loading: false, loadMoreLoading: false,  data: [] });
            handleError(response.data);
        });
};

export const setBusinessFormData = (businessFormData) => (dispatch) => {
    dispatch({ type: SET_BUSINESS_FORM_DATA_IN_REDUX, businessFormData });
};

export const getSingleBusiness = (id) => (dispatch) => {
    dispatch({ type: GET_SINGLE_BUSINESS_API, loading: true });
    axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}/${id}` })
        .then((response) => {
            dispatch({
                type: GET_SINGLE_BUSINESS_API,
                loading: false,
                data: response.data,
            });
        })
        .catch(({response}) => {
            dispatch({ type: GET_SINGLE_BUSINESS_API, loading: false });
            handleError(response.data);
        });
};

export const addReview = (payload, cb, id) => (dispatch) => {
    dispatch({ type: ADD_REVIEW_API });
    axiosApiInstance({
        method: 'POST',
        url: `${BUSINESSES_API}/${id}/review`,
        data: payload,
    })
        .then((response) => {
            dispatch({ type: ADD_REVIEW_API_SUCCESS });
            Toast.show({
                type: 'success',
                topOffset: 55,
                text1: 'Review Added',
                text2: 'Your Review has been added successfully.',
            });
            cb && cb();
        })
        .catch(({ response }) => {
            dispatch({ type: ADD_REVIEW_API_ERROR });
            handleError({ message: response.data.message[0] });
        });
};
