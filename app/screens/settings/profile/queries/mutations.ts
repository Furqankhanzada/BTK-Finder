import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from '@utils';

import axiosApiInstance from '../../../../interceptor/axios-interceptor';
import { DELETE_PROFILE, EDIT_PROFILE, UPLOAD } from '../../../../constants';
import { UserPresentable } from '../models/UserPresentable';

export interface DeleteMutationVar {
  confirm: boolean;
}

export interface DeleteUserAccountResponse {
  ownerOfBusinessesCount?: number;
  businessesWhereGaveReviewsCount?: number;
  reviewsOnYourBusinessesCount?: number;
  success?: boolean;
}

export type EditProfilePayload = Pick<
  UserPresentable,
  '_id' | 'name' | 'email' | 'phone' | 'avatar'
>;

export type EditProfileResponse = {
  data?: UserPresentable;
};

export interface UploadProfileImagePayload {
  user: EditProfilePayload;
  form: any;
}

export type UploadProfileImageResponse = {
  Location: string;
};

export const useDeleteUserAccount = () => {
  const queryClient = useQueryClient();
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
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  );
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<EditProfileResponse, Error, EditProfilePayload>(
    (payload) => {
      return axiosApiInstance({
        method: 'PUT',
        url: EDIT_PROFILE + payload._id,
        data: payload,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile']);
      },
    },
  );
};

export const useUploadProfileImage = () => {
  const { mutateAsync: editProfile } = useEditProfile();

  return useMutation<
    UploadProfileImageResponse,
    Error,
    UploadProfileImagePayload
  >(
    (payload) => {
      return axiosApiInstance
        .post(
          `${UPLOAD}?folder=users/${payload.user._id}/profile`,
          payload.form,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response, payload) => {
        const user = payload.user;
        const updatedUser = { ...user, avatar: response.Location };
        editProfile(updatedUser);
      },
    },
  );
};
