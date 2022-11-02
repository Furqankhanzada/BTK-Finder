import { useMutation } from '@tanstack/react-query';
import Config from 'react-native-config';
import { generateFileObject, handleError } from '../../../utils';

import { useSelector } from 'react-redux';
import useAddBusinessStore from '../store/Store';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { UPLOAD } from '../../../constants';


export const useAddNewThumbnail = () => {
  const setThumbnail = useAddBusinessStore((state: any) => state.setThumbnail);
  const store = useAddBusinessStore((state: any) => state);

  const user = useSelector((state: any) => state.profile);
  const { _id } = user;
  return useMutation((imagePath: any) => {
    const imageData = new FormData();
    imageData.append('file', generateFileObject(imagePath));
    return axiosApiInstance
      .post(
        `${Config.API_URL}/files/upload?folder=users/${_id}/businesses/`,
        imageData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      .then((res) => {
        setThumbnail(res.data.Location);
      })
      .catch((error) => {
        handleError(error);
      });
  });
};

export const useAddGalleryImages = () => {
  const setGallery = useAddBusinessStore((state: any) => state.setGallery);

  const user = useSelector((state: any) => state.profile);
  const { _id } = user;
  return useMutation((imagePath: any) => {
    const chunks = imagePath.map((file: any) => {
    return new Promise ( (resolve, reject) => {
    const imageData = new FormData();
    imageData.append('file', generateFileObject(file));
    return axiosApiInstance
      .post(
        `${UPLOAD}/${_id}/businesses/`,
        imageData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      .then((response) =>
          resolve({
            image: response.data.Location,
            cover: false,
          }),
        )
        .catch((error) => reject(error));
    })
  })
  Promise.all(chunks)
  .then((res) => {
    setGallery(res);
  })
  .catch((error) => {
    handleError(error);
  });

  })
};

// Add New Business to Server
export const useAddNewBusiness = () => {
  return useMutation((payload) => {
    return axiosApiInstance
    .post(
      `${Config.API_URL}/businesses`, payload,
    )
    .catch(({ response }) => {
      handleError(response.data);
    });
  });
}