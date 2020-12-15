import {
    CREATE_BUSINESS_API,
    CREATE_BUSINESS_API_SUCCESS,
    CREATE_BUSINESS_API_ERROR,
    SET_BUSINESS_FORM_DATA_IN_REDUX,
    GET_POPULAR_BUSINESSES_API,
    GET_RECENTLY_ADDED_BUSINESSES_API,
    GET_SINGLE_BUSINESS_API,
    GET_ALL_BUSINESSES_API, LOAD_MORE_ALL_BUSINESSES_API
} from '../constants/business';

//initial state.
const initialState = {
    getAllBusinessesLoading: false,
    allBusinesses: [],
    getAllBusinessesLoadMoreLoading: false,
    getAllBusinessesIsLoadMore: true,
    getAllBusinessesIsLoad: true,
    businessFormData: {},
    createBusinessLoading: false,
    getAllPopularBusinessesLoading: false,
    allPopularBusinesses: [],
    getPopularBusinessesLoading: false,
    popularBusinesses: [],
    getRecentlyAddedBusinessesLoading: false,
    recentlyAddedBusinesses: [],
    getSingleBusinessLoading: true,
    singleBusiness: {},
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
        case GET_ALL_BUSINESSES_API:
            return {
                ...state,
                allBusinesses: action.data,
                getAllBusinessesLoading: action.loading,
                getAllBusinessesLoadMoreLoading: true,
                getAllBusinessesLoadMore: true
            };
        case LOAD_MORE_ALL_BUSINESSES_API:
            return {
                ...state,
                allBusinesses: [...state.allBusinesses, ...action.data],
                getAllBusinessesLoading: false,
                getAllBusinessesLoadMoreLoading: action.loadMoreLoading,
                getAllBusinessesLoadMore: action.isLoadMore
            };
        case GET_SINGLE_BUSINESS_API:
            return {
                ...state,
                singleBusiness: action.data || {},
                getSingleBusinessLoading: action.loading,
            };
        default:
            return state;
    }
}
