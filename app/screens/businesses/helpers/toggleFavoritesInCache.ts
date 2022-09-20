import { QueryClient } from '@tanstack/react-query';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { BusinessesQueryKeysWithFav } from '@screens/businesses/models/BusinessesQueryKeys';
import { FavoritesMutationVar } from '@screens/businesses/queries/mutations';
import { handleError } from '@utils';

export const toggleFavoritesInCache = (
  queryClient: QueryClient,
  variables: FavoritesMutationVar,
  currentUserId: string,
  updatedBusiness: BusinessPresentable,
) => {
  queryClient.invalidateQueries(['favourite-businesses']).catch(handleError);
  queryClient
    .getQueryCache()
    .getAll()
    .forEach((query) => {
      if (
        query.queryKey.includes('businesses') ||
        query.queryKey.includes('business') ||
        Object.keys(BusinessesQueryKeysWithFav).some((keysWithFav) =>
          query.queryKey.includes(keysWithFav),
        )
      ) {
        const oldBusinessOrBusinesses:
          | Array<BusinessPresentable>
          | BusinessPresentable
          | undefined = queryClient.getQueryData(query.queryKey);

        if (oldBusinessOrBusinesses) {
          if (Array.isArray(oldBusinessOrBusinesses)) {
            const newBusinesses = oldBusinessOrBusinesses.map((oldBusiness) => {
              return updatedBusiness._id === oldBusiness._id
                ? { ...oldBusiness, favorites: updatedBusiness.favorites }
                : oldBusiness;
            });
            queryClient.setQueryData(query.queryKey, newBusinesses);
          } else {
            if (oldBusinessOrBusinesses) {
              let newBusiness: BusinessPresentable = {
                ...oldBusinessOrBusinesses,
                favorites: updatedBusiness.favorites,
              };
              queryClient.setQueryData(query.queryKey, newBusiness);
            }
          }
        }
      }
    });
};
