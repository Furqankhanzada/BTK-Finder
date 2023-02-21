import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import {
  BusinessPresentable,
  Facility,
  Gallery,
  Location,
  OpenHours,
  PriceRange,
} from '@screens/businesses/models/BusinessPresentable';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { generateFileObject, handleError } from '../../../utils';
import { BUSINESSES_API, UPLOAD } from '../../../constants';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';

export interface AddBusinessPayload {
  name: string;
  description?: string;
  category: string;
  facilities?: Facility[];
  tags?: string[];
  telephone?: string;
  email?: string;
  website?: string;
  address: string;
  location: Location;
  openHours?: OpenHours[];
  priceRange?: PriceRange;
  thumbnail?: string;
  gallery?: Gallery[];
}

interface EditBusinessPayload {
  name?: string;
  description?: string;
  category?: string;
  facilities?: Facility[];
  tags?: string[];
  telephone?: string;
  email?: string;
  website?: string;
  address?: string;
  location?: Location;
  openHours?: OpenHours[];
  priceRange?: PriceRange;
  thumbnail?: string;
  gallery?: Gallery[];
}

export const useAddThumbnail = () => {
  const setThumbnail = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setThumbnail,
  );

  const user = useSelector((state: any) => state.profile);
  const { _id } = user;
  return useMutation((imagePath: any) => {
    const imageData = new FormData();
    imageData.append('file', generateFileObject(imagePath));
    return axiosApiInstance
      .post(`${UPLOAD}?folder=users/${_id}/businesses`, imageData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        setThumbnail(res.data.Location);
      })
      .catch((error) => {
        handleError(error);
      });
  });
};

export const useAddGalleryImages = () => {
  const setGallery = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setGallery,
  );
  const gallery = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.gallery,
  );

  const user = useSelector((state: any) => state.profile);
  const { _id } = user;
  return useMutation((imagePath: any) => {
    console.log('@imagePath', imagePath);
    const chunks = imagePath.map((file: any) => {
      return new Promise((resolve, reject) => {
        const imageData = new FormData();
        imageData.append('file', generateFileObject(file));
        return axiosApiInstance
          .post(`${UPLOAD}?folder=users/${_id}/businesses`, imageData, {
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
        setGallery([...gallery, ...res]);
      })
      .catch((error) => {
        handleError(error);
      });
  });
};

export const useAddBusiness = () => {
  return useMutation<BusinessPresentable, Error, AddBusinessPayload>(
    (payload) => {
      return axiosApiInstance
        .post(`${BUSINESSES_API}`, payload)
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
    },
  );
};

export const useEditBusiness = (id: string) => {
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
