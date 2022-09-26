import { useMutation } from '@tanstack/react-query';
import Config from 'react-native-config';
import { handleError } from '@utils';

import { useSelector } from 'react-redux';

import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const useAddNewImages = () => {
  const user = useSelector((state: any) => state.profile);
  const { _id } = user;
  return useMutation((imagePath: any) => {
    const imageData = new FormData();
    imageData.append('file', {
      uri: imagePath,
      name: 'image.png',
      fileName: 'image',
      type: 'image/png',
    });
    return axiosApiInstance
      .post(
        `${Config.API_URL}/files/upload?folder=users/${_id}/businesses/`,
        imageData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
