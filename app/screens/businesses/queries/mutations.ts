import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@utils';
import Toast from 'react-native-toast-message';

import {
  BusinessPresentable,
  Membership,
  MembershipStatus,
  Package,
  Review,
} from '@screens/businesses/models/BusinessPresentable';
import { useDynamicLinks } from '@hooks';
import { toggleFavoritesInCache } from '@screens/businesses/helpers/toggleFavoritesInCache';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import useAuthStore from '@screens/auth/store/Store';

export enum FavoriteType {
  favorite = 'favorite',
  unFavorite = 'unfavorite',
}

export interface FavoritesMutationVar {
  businessId: string;
  type: FavoriteType;
}

export interface UpdateMembershipPayload {
  status: MembershipStatus;
  email: string;
  package: Package;
  billingDate: Date;
}

export interface AddMembershipPayload {
  email: string;
  package: Package;
  billingDate: Date;
}

export type AddReviewPayload = Pick<Review, 'title' | 'description' | 'rating'>;

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

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
        if (user?._id) {
          toggleFavoritesInCache(queryClient, variables, user?._id, response);
        }
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

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { businessId: string }>(
    (payload) => {
      return axiosApiInstance({
        method: 'DELETE',
        url: `${BUSINESSES_API}/${payload.businessId}`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['my-business']);
      },
    },
  );
};

export const useMembershipUpdate = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Membership, Error, UpdateMembershipPayload>(
    (payload) => {
      return axiosApiInstance({
        method: 'PUT',
        url: `${BUSINESSES_API}/${id}/member`,
        data: payload,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response) => {
        if (response.email) {
          await queryClient.invalidateQueries({
            queryKey: ['members', id],
          });
        }
      },
    },
  );
};

export const useAddMembership = (id: string) => {
  return useMutation<
    { message: string } | Membership,
    Error,
    AddMembershipPayload
  >((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: `${BUSINESSES_API}/${id}/member`,
      data: payload,
    })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; businessId: string },
    Error,
    { id: string; email: string }
  >(
    (payload) => {
      return axiosApiInstance({
        method: 'DELETE',
        url: `${BUSINESSES_API}/${payload.id}/member`,
        params: {
          email: payload.email,
        },
      })
        .then((response) => {
          return { ...response.data, businessId: payload.id };
        })
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response) => {
        if (response.message === 'success') {
          await queryClient.invalidateQueries({
            queryKey: ['members', response.businessId],
          });
        }
      },
    },
  );
};
