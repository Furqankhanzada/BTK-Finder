import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '../../../utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import Toast from 'react-native-toast-message';
import {
  Facility,
  Gallery,
  OpenHours,
  PriceRange,
} from '@screens/businesses/models/BusinessPresentable';

export interface Location {
  type: string;
  coordinates: number[];
}

export interface AddBusinessPayload {
  name: string;
  description?: string;
  category: string;
  facilities?: Facility;
  tags?: Array<string>;
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

export interface EditBusinessPayload {
  name?: string;
  description?: string;
  category?: string;
  facilities?: Facility[];
  tags?: any;
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
