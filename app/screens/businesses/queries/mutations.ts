import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@utils';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { useSelector, useDispatch } from 'react-redux';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';

import { getFavoriteBusinesses } from '../../../actions/favorites';

export enum FavoriteType {
  favorite = 'favorite',
  unFavorite = 'unfavorite',
}

interface MutationPayload {
  businessId: string;
  type: FavoriteType;
}

export const useToggleFavorite = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: any) => state.profile);

  return useMutation(
    ({ businessId, type }: MutationPayload) => {
      return axiosApiInstance({
        method: type === FavoriteType.favorite ? 'POST' : 'DELETE',
        url: `${BUSINESSES_API}/${businessId}/favorite`,
      }).catch(({ response }) => {
        handleError(response.data);
      });
    },
    {
      onSuccess: (_, variables) => {
        const oldBusiness: BusinessPresentable | undefined =
          queryClient.getQueryData(['business', variables.businessId]);
        if (oldBusiness) {
          let newBusiness: BusinessPresentable;
          const oldFavorites = oldBusiness.favorites
            ? oldBusiness.favorites
            : [];
          if (variables.type === FavoriteType.favorite) {
            newBusiness = {
              ...oldBusiness,
              favorites: [...oldFavorites, { ownerId: user._id }],
            };
          } else {
            newBusiness = {
              ...oldBusiness,
              favorites: oldFavorites.filter(
                (favorite) => favorite.ownerId !== user._id,
              ),
            };
          }
          queryClient.setQueryData(
            ['business', variables.businessId],
            newBusiness,
          );
        }
        // TODO: Remove this after the dashboard is refactored
        dispatch(
          getFavoriteBusinesses({
            favorite: true,
            skip: 0,
            fields: 'name, thumbnail, category, averageRatings',
          }),
        );
      },
    },
  );
};
