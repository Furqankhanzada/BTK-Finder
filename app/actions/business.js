import { CREATE_BUSINESS, GET_BUSINESSES } from '../constants';
import {
    CREATE_BUSINESS_API,
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    GET_BUSINESSES_API_SUCCESS,
    GET_BUSINESSES_API_ERROR,
    SET_BUSINESS_FORM_DATA_IN_REDUX,
} from '../constants/business';
import { handleError } from '../utils';
import axiosApiInstance from "../interceptor/axios-interceptor";
import Toast from "react-native-toast-message";

export const createBusiness = (payload, cb) => (dispatch) => {
    dispatch({type:CREATE_BUSINESS_API})
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
        .catch(({response}) => {
            dispatch({ type: CREATE_BUSINESS_API_ERROR });
            handleError({message: response.data.message[0]});
        });
};

export const getBusinesses = (cb) => {
    return async (dispatch)  => {
      axiosApiInstance({
        method: 'GET',
        url: GET_BUSINESSES,
      })
        .then((response) => {
          dispatch({
            type: GET_BUSINESSES_API_SUCCESS,
              businesses: response.data,
          });
          cb && cb();
        })
        .catch((error) => {
          dispatch({ type: GET_BUSINESSES_API_ERROR, error });
          cb && cb(error);
          handleError(error);
          console.log('###### BUSINESSES API ERROR', error);
        });
    };
};

export const setBusinessFormData = (businessFormData) => {
    return async (dispatch)  => {
        dispatch({type: SET_BUSINESS_FORM_DATA_IN_REDUX, businessFormData});
    }
};
