import {
    CREATE_BUSINESS_API,
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    GET_BUSINESSES_API_SUCCESS,
    GET_BUSINESSES_API_ERROR,
    SET_BUSINESS_FORM_DATA_IN_REDUX
} from '../constants/business';

//initial state.
const initialState = {
    all: [],
    businessFormData: {},
    createBusinessLoading: false
};

export default function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_BUSINESS_FORM_DATA_IN_REDUX:
            return {...state, businessFormData: {...state.businessFormData, ...action.businessFormData}};
        case CREATE_BUSINESS_API:
            return {...state, createBusinessLoading: true};
        case CREATE_BUSINESS_API_SUCCESS:
            return {...state, businessFormData: {}, createBusinessLoading: false};
        case CREATE_BUSINESS_API_ERROR:
            return {...state, createBusinessLoading: false};
        // return Object.assign({}, state, action.businesses);
        //   return {...state, };
        // case CREATE_BUSINESS_API_ERROR:
        //   return Object.assign({}, state, action.error);
        // case GET_BUSINESSES_API_SUCCESS:
        //   return Object.assign({}, state, action.businesses);
        // case GET_BUSINESSES_API_ERROR:
        //   return Object.assign({}, state, action.error);
        default:
            return state;
    }
}
