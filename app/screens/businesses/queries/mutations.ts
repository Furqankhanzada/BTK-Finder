import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@utils';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { useSelector } from 'react-redux';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';

import { useDynamicLinks } from '@hooks';
import { toggleFavoritesInCache } from '@screens/businesses/helpers/toggleFavoritesInCache';

export enum FavoriteType {
  favorite = 'favorite',
  unFavorite = 'unfavorite',
}

export interface FavoritesMutationVar {
  businessId: string;
  type: FavoriteType;
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
