import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@utils';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import {
  BusinessPresentable,
  Review,
} from '@screens/businesses/models/BusinessPresentable';
import { useDynamicLinks } from '@hooks';
import { toggleFavoritesInCache } from '@screens/businesses/helpers/toggleFavoritesInCache';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';

export enum FavoriteType {
  favorite = 'favorite',
  unFavorite = 'unfavorite',
}

export interface FavoritesMutationVar {
  businessId: string;
  type: FavoriteType;
}

export type AddReviewPayload = Pick<Review, 'title' | 'description' | 'rating'>;

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
export const useAddReview = (id: string) => {
  const queryClient = useQueryClient();

  //TODO: we need to fix response (BusinessPresentable) in the backend
  return useMutation<BusinessPresentable, Error, AddReviewPayload>(
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
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['business', id],
        });
        // TODO: we need to change toast after recent pr marge
        Toast.show({
          type: 'success',
          topOffset: 55,
          text1: 'Review Added Successfully ',
          text2: 'The review has been added successfully.',
        });
      },
    },
  );
};
