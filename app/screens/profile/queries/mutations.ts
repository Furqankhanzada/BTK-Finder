import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DELETE_PROFILE, EDIT_PROFILE } from '../../../constants';

export interface DeleteMutationVar {
  confirm: boolean;
}

export interface DeleteUserAccountResponse {
  ownerOfBusinessesCount?: number;
  businessesWhereGaveReviewsCount?: number;
  reviewsOnYourBusinessesCount?: number;
  success?: boolean;
}

export interface EditProfileVar {
  name: string;
  email: string;
  phone: string;
  _id: number;
}

export const useDeleteUserAccount = () => {
  return useMutation<DeleteUserAccountResponse, Error, DeleteMutationVar>(
    ({ confirm }) => {
      return axiosApiInstance({
        method: 'DELETE',
        url: `${DELETE_PROFILE}?confirm=${confirm}`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
  );
};

export const useEditProfile = () => {
  return useMutation<any, Error, EditProfileVar>((payload) => {
    return axiosApiInstance({
      method: 'PUT',
      url: EDIT_PROFILE + payload._id,
      data: payload,
    })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
