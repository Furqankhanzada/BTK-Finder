import {
  CREATE_BUSINESS_API,
  CREATE_BUSINESS_API_SUCCESS,
  CREATE_BUSINESS_API_ERROR,
  SET_BUSINESS_FORM_DATA_IN_REDUX,
  GET_POPULAR_BUSINESSES_API,
  GET_RECENTLY_ADDED_BUSINESSES_API,
  GET_SINGLE_BUSINESS_API,
  GET_RELATED_BUSINESS_API,
  GET_MY_BUSINESSES_API,
  SET_EDIT_BUSINESS,
  UPDATE_EDIT_BUSINESS_DATA,
  GET_EDIT_BUSINESS_DATA,
  UPDATE_BUSINESS_API,
  UPDATE_BUSINESS_API_SUCCESS,
  UPDATE_BUSINESS_API_ERROR,
  GET_ALL_BUSINESSES_API,
  LOAD_MORE_ALL_BUSINESSES_API,
  ADD_REVIEW_API,
  ADD_REVIEW_API_SUCCESS,
  ADD_REVIEW_API_ERROR,
  TOGGLE_FAVORITE,
  UPLOAD_THUMBNAIL_IMAGE_API,
  REMOVE_THUMBNAIL_IMAGES,
  UPLOAD_GALLERY_IMAGES_API,
  REMOVE_GALLERY_IMAGES,
} from '../constants/business';

//initial state.
const initialState = {
  getAllBusinessesLoading: false,
  allBusinesses: [],
  getAllBusinessesLoadMoreLoading: false,
  getAllBusinessesIsLoadMore: true,
  getAllBusinessesIsLoad: true,
  businessFormData: {},
  editBusinessData: {},
  createBusinessLoading: false,
  getAllPopularBusinessesLoading: false,
  allPopularBusinesses: [],
  getPopularBusinessesLoading: false,
  popularBusinesses: [],
  getRecentlyAddedBusinessesLoading: false,
  recentlyAddedBusinesses: [],
  getSingleBusinessLoading: false,
  singleBusiness: {},
  getRelatedBusinessesLoading: false,
  relatedBusinesses: [],
  getMyBusinessesLoading: false,
  myBusinesses: [],
  editBusiness: false,
  editBusinessLoading: false,
  createReviewLoading: false,
  review: {},
  favoriteIds: [],
  gallery: [],
  galleryLoading: false,
  thumbnail: '',
  thumbnailLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_BUSINESS_FORM_DATA_IN_REDUX:
      return {
        ...state,
        businessFormData: {
          ...state.businessFormData,
          ...action.businessFormData,
        },
      };
    case CREATE_BUSINESS_API:
      return { ...state, createBusinessLoading: true };
    case CREATE_BUSINESS_API_SUCCESS:
      return {
        ...state,
        businessFormData: {},
        createBusinessLoading: false,
        thumbnail: '',
        gallery: [],
      };
    case CREATE_BUSINESS_API_ERROR:
      return { ...state, createBusinessLoading: false };
    case GET_POPULAR_BUSINESSES_API:
      return {
        ...state,
        popularBusinesses: action.data || [],
        getPopularBusinessesLoading: action.loading,
      };
    case GET_RECENTLY_ADDED_BUSINESSES_API:
      return {
        ...state,
        recentlyAddedBusinesses: action.data || [],
        getRecentlyAddedBusinessesLoading: action.loading,
      };
    case GET_ALL_BUSINESSES_API:
      return {
        ...state,
        allBusinesses: action.data,
        getAllBusinessesLoading: action.loading,
        getAllBusinessesLoadMoreLoading: true,
        getAllBusinessesLoadMore: true,
      };
    case LOAD_MORE_ALL_BUSINESSES_API:
      return {
        ...state,
        allBusinesses: [...state.allBusinesses, ...action.data],
        getAllBusinessesLoading: false,
        getAllBusinessesLoadMoreLoading: action.loadMoreLoading,
        getAllBusinessesLoadMore: action.isLoadMore,
      };
    case GET_SINGLE_BUSINESS_API:
      return {
        ...state,
        singleBusiness: action.data || {},
        getSingleBusinessLoading: action.loading,
      };
    case GET_RELATED_BUSINESS_API:
      return {
        ...state,
        relatedBusinesses: action.data,
        getRelatedBusinessesLoading: action.loading,
      };
    case GET_MY_BUSINESSES_API:
      return {
        ...state,
        myBusinesses: action.data,
        getMyBusinessesLoading: action.loading,
      };
    case SET_EDIT_BUSINESS:
      return {
        ...state,
        editBusiness: action.editBusiness,
        thumbnail: '',
        gallery: [],
      };
    case UPDATE_EDIT_BUSINESS_DATA:
      return {
        ...state,
        editBusinessData: {
          ...state.editBusinessData,
          ...action.editBusinessData,
        },
      };
    case GET_EDIT_BUSINESS_DATA:
      return {
        ...state,
        editBusiness: true,
        editBusinessData: action.editBusinessData,
        thumbnail: action.thumbnail,
        gallery: action.gallery,
      };
    case UPDATE_BUSINESS_API:
      return {
        ...state,
        editBusinessLoading: true,
      };
    case UPDATE_BUSINESS_API_SUCCESS:
      return {
        ...state,
        editBusinessLoading: false,
        editBusinessData: {},
        thumbnail: '',
        gallery: [],
      };
    case UPDATE_BUSINESS_API_ERROR:
      return {
        ...state,
        editBusinessLoading: false,
      };
    case ADD_REVIEW_API:
      return { ...state, createReviewLoading: true };
    case ADD_REVIEW_API_SUCCESS:
      return { ...state, review: {}, createReviewLoading: false };
    case ADD_REVIEW_API_ERROR:
      return { ...state, createReviewLoading: false };
    case TOGGLE_FAVORITE:
      return { ...state, favoriteIds: action.ids };
    case UPLOAD_THUMBNAIL_IMAGE_API:
      return {
        ...state,
        thumbnail: action.thumbnail,
        thumbnailLoading: action.thumbnailLoading,
      };
    case REMOVE_THUMBNAIL_IMAGES:
      return {
        ...state,
        thumbnail: action.thumbnail,
        thumbnailLoading: action.thumbnailLoading,
      };
    case UPLOAD_GALLERY_IMAGES_API:
      let data = [...state.gallery, ...(action.gallery || [])];
      if (data.length && data[0] && !state.gallery.length) {
        data[0].cover = true;
      }
      return {
        ...state,
        gallery: data,
        galleryLoading: action.galleryLoading,
      };
    case REMOVE_GALLERY_IMAGES:
      return { ...state, gallery: action.gallery };
    default:
      return state;
  }
}
