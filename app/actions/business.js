import { BUSINESSES_API, UPLOAD } from '../constants';
import {
  CREATE_BUSINESS_API,
  CREATE_BUSINESS_API_SUCCESS,
  CREATE_BUSINESS_API_ERROR,
  SET_BUSINESS_FORM_DATA_IN_REDUX,
  GET_POPULAR_BUSINESSES_API,
  GET_RECENTLY_ADDED_BUSINESSES_API,
  GET_RECENTLY_ADDED_BUSINESSES_PLACE_DETAIL,
  GET_ALL_BUSINESSES_API,
  GET_SINGLE_BUSINESS_API,
  GET_RELATED_BUSINESS_API,
  GET_MY_BUSINESSES_API,
  UPDATE_BUSINESS_API,
  UPDATE_BUSINESS_API_SUCCESS,
  UPDATE_BUSINESS_API_ERROR,
  LOAD_MORE_ALL_BUSINESSES_API,
  ADD_REVIEW_API,
  ADD_REVIEW_API_SUCCESS,
  ADD_REVIEW_API_ERROR,
  TOGGLE_FAVORITE,
  UPLOAD_THUMBNAIL_IMAGE_API,
  REMOVE_THUMBNAIL_IMAGES,
  UPLOAD_GALLERY_IMAGES_API,
  REMOVE_GALLERY_IMAGES,
  GET_EDIT_BUSINESS_DATA,
  SET_EDIT_BUSINESS,
  UPDATE_EDIT_BUSINESS_DATA,
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
      dispatch({ type: CREATE_BUSINESS_API_SUCCESS });
      dispatch(
        getBusinesses({
          limit: 15,
          skip: 0,
          fields: 'name, thumbnail, category, averageRatings',
        }),
      );
      Toast.show({
        type: 'success',
        topOffset: 55,
        text1: 'Business Added',
        text2: 'You have Successfully added your Business!',
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
    if (payload.placeDetail) {
      dispatchType = GET_RECENTLY_ADDED_BUSINESSES_PLACE_DETAIL;
    } else {
      dispatchType = GET_RECENTLY_ADDED_BUSINESSES_API;
    }
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

export const getAllBusinesses = (payload, cb) => (dispatch) => {
  let dispatchType = GET_ALL_BUSINESSES_API;
  let dispatchParams = {
    loading: payload.loading,
    refreshLoading: payload.refreshLoading,
    loadMoreLoading: true,
    data: [],
  };
  if (payload.skip === 0) {
    dispatchParams = {
      isLoadMore: false,
      ...dispatchParams,
    };
  }
  let queryParams = encodeQueryData(payload)
    ? `?${encodeQueryData(payload)}`
    : '';

  if (payload.skip > 0) {
    dispatchType = LOAD_MORE_ALL_BUSINESSES_API;
    dispatchParams = { ...dispatchParams, refreshLoading: false };
  }

  dispatch({
    type: dispatchType,
    ...dispatchParams,
  });

  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}${queryParams}` })
    .then((response) => {
      dispatch({
        type: dispatchType,
        loading: false,
        refreshLoading: false,
        loadMoreLoading: false,
        data: response.data || [],
        isLoadMore: response.data.length < 10,
      });
      cb && cb();
    })
    .catch(({ response }) => {
      dispatch({
        type: dispatchType,
        loadMoreLoading: false,
        loading: false,
        refreshLoading: false,
        data: [],
      });
      handleError(response.data);
    });
};

export const getRelatedBusinesses = (payload) => (dispatch) => {
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

export const setEditBusiness = (editBusiness) => (dispatch) => {
  dispatch({ type: SET_EDIT_BUSINESS, editBusiness: editBusiness });
};

export const getEditBusinessData = (formData, thumbnail, gallery) => (
  dispatch,
) => {
  dispatch({
    type: GET_EDIT_BUSINESS_DATA,
    editBusinessData: formData,
    thumbnail: thumbnail,
    gallery: gallery,
  });
};

export const updateEditBusinessData = (editBusinessData) => (dispatch) => {
  dispatch({ type: UPDATE_EDIT_BUSINESS_DATA, editBusinessData });
};

export const getSingleBusiness = (id, editBusiness = false, cb) => (
  dispatch,
) => {
  dispatch({ type: GET_SINGLE_BUSINESS_API, loading: true });
  axiosApiInstance({ method: 'GET', url: `${BUSINESSES_API}/${id}` })
    .then((response) => {
      editBusiness
        ? dispatch(
            getEditBusinessData(
              response.data,
              response.data.thumbnail,
              response.data.gallery,
            ),
          )
        : null;
      dispatch({
        type: GET_SINGLE_BUSINESS_API,
        loading: false,
        data: response.data,
      });
      cb && cb();
    })
    .catch(({ response }) => {
      dispatch({ type: GET_SINGLE_BUSINESS_API, loading: false });
      handleError(response.data);
    });
};

export const updateBusiness = (payload, id, cb) => (dispatch) => {
  dispatch({ type: UPDATE_BUSINESS_API });
  axiosApiInstance({
    method: 'PUT',
    url: `${BUSINESSES_API}/${id}`,
    data: payload,
  })
    .then((response) => {
      dispatch({ type: UPDATE_BUSINESS_API_SUCCESS });
      Toast.show({
        type: 'success',
        topOffset: 55,
        text1: 'Business Updated',
        text2: 'You have Successfully updated your Business!',
      });
      cb && cb();
    })
    .catch(({ response }) => {
      dispatch({ type: UPDATE_BUSINESS_API_ERROR });
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
      dispatch(
        getBusinesses({
          limit: 15,
          skip: 0,
          fields: 'name, thumbnail, category, averageRatings',
        }),
      );
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
