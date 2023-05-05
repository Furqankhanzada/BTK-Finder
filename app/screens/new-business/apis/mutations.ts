import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'react-native-image-crop-picker';

import {
  BusinessPresentable,
  Facility,
  Gallery,
  Location,
  OpenHours,
  PriceRange,
} from '@screens/businesses/models/BusinessPresentable';
import { useAlerts } from '@hooks';
import { BaseColor } from '@config';
import useAuthStore from '@screens/auth/store/Store';

import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { generateFileObject, handleError } from '../../../utils';
import { BUSINESSES_API, UPLOAD } from '../../../constants';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';

export type AddBusinessPayload = Pick<
  BusinessPresentable,
  | 'name'
  | 'description'
  | 'category'
  | 'facilities'
  | 'tags'
  | 'telephone'
  | 'email'
  | 'website'
  | 'address'
  | 'location'
  | 'openHours'
  | 'priceRange'
  | 'thumbnail'
  | 'gallery'
>;

type EditBusinessData = {
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
};

type EditBusinessPayload = {
  businessId: string;
  data: EditBusinessData;
};

type ImageResponse = {
  Location: string;
};

export const useAddThumbnail = () => {
  const setThumbnail = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setThumbnail,
  );

  const { user } = useAuthStore();

  return useMutation<ImageResponse, Error, Image>((image) => {
    const imageData = new FormData();
    imageData.append('file', generateFileObject(image));
    return axiosApiInstance
      .post(`${UPLOAD}?folder=users/${user?._id}/businesses`, imageData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        setThumbnail(res.data.Location);
        return res.data;
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

  const { user } = useAuthStore();

  // TODO: Fix types.
  return useMutation<any, Error, any>(async (images) => {
    const uploadImagePromises = images.map((file: any) => {
      return new Promise((resolve, reject) => {
        const imageData = new FormData();
        imageData.append('file', generateFileObject(file));
        return axiosApiInstance
          .post(`${UPLOAD}?folder=users/${user?._id}/businesses`, imageData, {
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
    const result = await Promise.all(uploadImagePromises);

    if (gallery) {
      setGallery([...gallery, ...result]);
    } else {
      setGallery([...result]);
    }
    return result;
  });
};

export const useAddBusiness = () => {
  const { showNotification } = useAlerts();

  return useMutation<BusinessPresentable, Error, AddBusinessPayload>(
    (payload) => {
      return axiosApiInstance
        .post(`${BUSINESSES_API}`, payload)
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess() {
        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMarkCircle,
            color: BaseColor.greenColor,
          },
          message: 'You have Successfully added your Business!',
          dismissAfterMs: 3000,
        });
      },
    },
  );
};

export const useEditBusiness = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAlerts();

  // TODO: will change response type after fixing response from backend.
  return useMutation<any, Error, EditBusinessPayload>(
    (payload) => {
      return axiosApiInstance
        .put(`${BUSINESSES_API}/${payload.businessId}`, payload.data)
        .then(() => {
          return { businessId: payload.businessId };
        })
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response) => {
        await queryClient.invalidateQueries({
          queryKey: ['business', response.businessId],
        });

        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMarkCircle,
            color: BaseColor.greenColor,
          },
          message: 'You have Successfully updated your Business!',
          dismissAfterMs: 3000,
        });
      },
    },
  );
};
