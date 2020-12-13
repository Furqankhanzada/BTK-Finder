import {
    CREATE_BUSINESS_API,
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    SET_BUSINESS_FORM_DATA_IN_REDUX,
    GET_POPULAR_BUSINESSES_API,
        GET_RECENTLY_ADDED_BUSINESSES_API
} from '../constants/business';

//initial state.
const initialState = {
    all: [],
    businessFormData: {},
    createBusinessLoading: false,
    getPopularBusinessesLoading: false,
    popularBusinesses: [],
    getRecentlyAddedBusinessesLoading: false,
    recentlyAddedBusinesses: []
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
        case GET_POPULAR_BUSINESSES_API:
            return {
                ...state,
                popularBusinesses: action.data || [],
                getPopularBusinessesLoading: action.loading
            };
        case GET_RECENTLY_ADDED_BUSINESSES_API:
            return {
                ...state,
                recentlyAddedBusinesses: action.data || [],
                getRecentlyAddedBusinessesLoading: action.loading
            };
        default:
            return state;
    }
}
