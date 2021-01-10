import { BUSINESSES_API, UPLOAD } from '../constants';
import {
  CREATE_BUSINESS_API,
  CREATE_BUSINESS_API_SUCCESS,
  CREATE_BUSINESS_API_ERROR,
  SET_BUSINESS_FORM_DATA_IN_REDUX,
  GET_POPULAR_BUSINESSES_API,
  GET_RECENTLY_ADDED_BUSINESSES_API,
  GET_ALL_BUSINESSES_API,
  GET_SINGLE_BUSINESS_API,
  GET_RELATED_BUSINESS_API,
  GET_MY_BUSINESSES_API,
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
import { generateFileObject, handleError } from '../utils';
import axiosApiInstance from '../interceptor/axios-interceptor';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';

export const createBusiness = (payload, cb) => (dispatch) => {
  dispatch({ type: CREATE_BUSINESS_API });
  axiosApiInstance({
    method: 'POST',
    url: BUSINESSES_API,
    data: payload,
  })
    .then((response) => {
      console.log('response', response);
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
    .catch(({ response }) => {
      dispatch({ type: dispatchType, loading: false });
      handleError(response.data);
    });
};

export const getAllBusinesses = (payload) => (dispatch) => {
  let dispatchType = GET_ALL_BUSINESSES_API;
  let queryParams = encodeQueryData(payload)
    ? `?${encodeQueryData(payload)}`
    : '';

  if (payload.skip > 0) {
    dispatchType = LOAD_MORE_ALL_BUSINESSES_API;
  }

  dispatch({
    type: dispatchType,
    loading: true,
    loadMoreLoading: true,
    data: [],
  });

  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}${queryParams}` })
    .then((response) => {
      dispatch({
        type: dispatchType,
        loading: false,
        loadMoreLoading: false,
        data: response.data || [],
        isLoadMore: !(response.data && response.data.length < 10),
      });
    })
    .catch(({ response }) => {
      dispatch({
        type: dispatchType,
        loading: false,
        loadMoreLoading: false,
        data: [],
      });
      handleError(response.data);
    });
};

export const getRalatedBusinesses = (payload) => (dispatch) => {
  let queryParams = encodeQueryData(payload)
    ? `?${encodeQueryData(payload)}`
    : '';
  dispatch({ type: GET_RELATED_BUSINESS_API, loading: true });
  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}${queryParams}` })
    .then((response) => {
      dispatch({
        type: GET_RELATED_BUSINESS_API,
        loading: false,
        data: response.data || [],
      });
    })
    .catch(({ response }) => {
      dispatch({
        type: GET_RELATED_BUSINESS_API,
        loading: false,
        data: [],
      });
      handleError(response.data);
    });
};

export const getMyBusinesses = (payload) => (dispatch) => {
  let queryParams = encodeQueryData(payload)
    ? `?${encodeQueryData(payload)}`
    : '';
  dispatch({ type: GET_MY_BUSINESSES_API, loading: true });
  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}${queryParams}` })
    .then((response) => {
      dispatch({
        type: GET_MY_BUSINESSES_API,
        loading: false,
        data: response.data || [],
      });
    })
    .catch(({ response }) => {
      dispatch({
        type: GET_MY_BUSINESSES_API,
        loading: false,
        data: [],
      });
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
    .catch(({ response }) => {
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
      dispatch(getSingleBusiness(id));
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

export const getFavoriteIdsIntoStorage = () => async (dispatch) => {
  try {
    const jsonValue = await AsyncStorage.getItem('FAVORITE_IDS');
    dispatch({
      type: TOGGLE_FAVORITE,
      ids: jsonValue != null ? JSON.parse(jsonValue) : null,
    });
  } catch (e) {
    // error reading value
  }
};

export const toggleFavorite = (id) => async (dispatch, getState) => {
  try {
    const { businesses } = getState();
    const { favoriteIds } = businesses;
    const jsonValue = await AsyncStorage.getItem('FAVORITE_IDS');
    let ids = [];
    if (jsonValue) {
      ids = JSON.parse(jsonValue);
    } else {
      ids = favoriteIds && favoriteIds.length ? [...favoriteIds] : [];
    }
    if (ids?.length && ids.includes(id)) {
      ids = ids.filter((el) => el !== id);
    } else {
      ids.push(id);
    }
    dispatch({ type: TOGGLE_FAVORITE, ids });
    AsyncStorage.setItem('FAVORITE_IDS', JSON.stringify(ids));
  } catch (e) {
    // error reading value
  }
};

export const uploadImages = (image) => (dispatch, getState) => {
  const { profile } = getState();
  const { _id } = profile;
  const form = new FormData();
  form.append('file', generateFileObject(image));
  dispatch({ type: UPLOAD_THUMBNAIL_IMAGE_API, thumbnailLoading: true });
  axiosApiInstance
    .post(`${UPLOAD}/${_id}/businesses/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((response) => {
      dispatch({
        type: UPLOAD_THUMBNAIL_IMAGE_API,
        thumbnail: response?.data?.Location || '',
        thumbnailLoading: false,
      });
    })
    .catch((error) => {
      dispatch({ type: UPLOAD_THUMBNAIL_IMAGE_API, thumbnailLoading: false });
      handleError(error);
    });
};

export const updateImagesIntoRedux = (type, payload) => (dispatch) => {
  let dispatchType =
    type === 'thumbnail' ? REMOVE_THUMBNAIL_IMAGES : REMOVE_GALLERY_IMAGES;
  dispatch({ type: dispatchType, gallery: payload, thumbnail: payload });
};

export const uploadGalleryImages = (payload) => (dispatch, getState) => {
  const { profile } = getState();
  const { _id } = profile;
  dispatch({ type: UPLOAD_GALLERY_IMAGES_API, galleryLoading: true });
  const chunks = payload.map((file) => {
    return new Promise((resolve, reject) => {
      let form = new FormData();
      form.append('file', generateFileObject(file));
      axiosApiInstance
        .post(`${UPLOAD}/${_id}/businesses/`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) =>
          resolve({
            image: response.data.Location,
            cover: false,
          }),
        )
        .catch((error) => reject(error));
    });
  });
  Promise.all(chunks)
    .then((res) => {
      dispatch({
        type: UPLOAD_GALLERY_IMAGES_API,
        gallery: res,
        galleryLoading: false,
      });
    })
    .catch((error) => {
      dispatch({ type: UPLOAD_GALLERY_IMAGES_API, galleryLoading: false });
      handleError(error);
    });
};
