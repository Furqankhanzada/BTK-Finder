import { useMutation, useQueryClient } from '@tanstack/react-query';
import Config from 'react-native-config';
import { generateFileObject, handleError } from '../../../utils';

import { useSelector } from 'react-redux';
import useAddBusinessStore from '../store/Store';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API, UPLOAD } from '../../../constants';
import Toast from 'react-native-toast-message';
import {
  Facility,
  Gallery,
  Location,
  OpenHours,
} from '@screens/businesses/models/BusinessPresentable';

export interface EditBusinessPayload {
  name?: string;
  description?: string;
  category?: string;
  facilities?: Facility[];
  tags?: any;
  telephone?: string;
  email?: string;
  website?: string;
  established?: string;
  address?: string;
  location?: any;
  openHours?: OpenHours[];
  priceRange?: { from: string; to: string };
  thumbnail?: string;
  gallery?: Gallery[];
}

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
      return new Promise((resolve, reject) => {
        const imageData = new FormData();
        imageData.append('file', generateFileObject(file));
        return axiosApiInstance
          .post(`${UPLOAD}/${_id}/businesses/`, imageData, {
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
        setGallery(res);
      })
      .catch((error) => {
        handleError(error);
      });
  });
};

// Add New Business to Server
export const useAddNewBusiness = () => {
  return useMutation((payload) => {
    return axiosApiInstance
      .post(`${Config.API_URL}/businesses`, payload)
      .then((response) => {
        Toast.show({
          type: 'success',
          topOffset: 55,
          text1: 'Business Added',
          text2: 'You have Successfully Add your Business!',
        });
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};

// Edit Business
export const useEditBusiness = (id: any) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, EditBusinessPayload>(
    (payload) => {
      return axiosApiInstance
        .put(`${BUSINESSES_API}/${id}`, payload)
        .then(() => {
          Toast.show({
            type: 'success',
            topOffset: 55,
            text1: 'Business Updated',
            text2: 'You have Successfully updated your Business!',
          });
        })
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['business', id],
        });
      },
    },
  );
};
