import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@utils';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { useSelector } from 'react-redux';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';

import { useDynamicLinks } from '@hooks';
import { toggleFavoritesInCache } from '@screens/businesses/helpers/toggleFavoritesInCache';
import Toast from 'react-native-toast-message';

export enum FavoriteType {
  favorite = 'favorite',
  unFavorite = 'unfavorite',
}

export interface FavoritesMutationVar {
  businessId: string;
  type: FavoriteType;
}

export interface ReviewsPayload {
  title: string;
  description: string;
  rating: number;
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: any) => state.profile);

  return useMutation<BusinessPresentable, Error, FavoritesMutationVar>(
    ({ businessId, type }) => {
      return axiosApiInstance({
        method: type === FavoriteType.favorite ? 'POST' : 'DELETE',
        url: `${BUSINESSES_API}/${businessId}/favorite`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: (response, variables) => {
        toggleFavoritesInCache(queryClient, variables, user._id, response);
      },
    },
  );
};

export const useBuildBusinessURL = () => {
  const buildBusinessURL = useDynamicLinks();
  return useMutation((businessId: string) => buildBusinessURL(businessId), {});
};

// Reviews Mutate
export const useReviews = (id: string) => {
  const queryClient = useQueryClient();

  //TODO: we need to fix response (BusinessPresentable) in the backend
  return useMutation<BusinessPresentable, Error, ReviewsPayload>(
    (payload) => {
      return axiosApiInstance({
        method: 'POST',
        url: `${BUSINESSES_API}/${id}/review`,
        data: payload,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['business', id],
        });
        Toast.show({
          type: 'success',
          topOffset: 55,
          text1: 'Review Added',
          text2: 'Your Review has been added successfully.',
        });
      },
    },
  );
};
