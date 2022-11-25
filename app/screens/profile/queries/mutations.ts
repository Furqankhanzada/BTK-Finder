import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DELETE_PROFILE, EDIT_PROFILE, UPLOAD } from '../../../constants';
import { EDIT_PROFILE_API_SUCCESS } from '../../../constants/auth';

export interface DeleteMutationVar {
  confirm: boolean;
}

export interface DeleteUserAccountResponse {
  ownerOfBusinessesCount?: number;
  businessesWhereGaveReviewsCount?: number;
  reviewsOnYourBusinessesCount?: number;
  success?: boolean;
}

export interface EditProfilePayload {
  _id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface UploadProfileImagePayload {
  user: EditProfilePayload;
  form: any;
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
  return useMutation<any, Error, EditProfilePayload>((payload) => {
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

export const useUploadProfileImage = () => {
  const { mutateAsync: editProfile } = useEditProfile();
  const dispatch = useDispatch();

  return useMutation<any, Error, UploadProfileImagePayload>(
    (payload) => {
      return axiosApiInstance
        .post(`${UPLOAD}/${payload.user._id}/profile`, payload.form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          const user = payload.user;
          const updatedUser = { ...user, avatar: response.data.Location };
          return updatedUser;
        })
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response: EditProfilePayload) => {
        const editUserProfile = await editProfile(response);

        if (editUserProfile !== undefined) {
          //Update User in Redux
          //TODO: Will fix once we remove the redux from project.
          dispatch({
            type: EDIT_PROFILE_API_SUCCESS,
            user: response,
          });
        }
      },
    },
  );
};
