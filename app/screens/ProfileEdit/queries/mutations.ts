import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { handleError } from '@utils';
import { useAlerts } from '@hooks';
import { BaseColor, useTheme } from '@config';
import { AuthActions } from '@actions';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DELETE_PROFILE } from '../../../constants';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';

export interface DeleteMutationVar {
  type: boolean;
}

export const useDeleteUserAccount = () => {
  const { showAlert, showNotification } = useAlerts();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const fetchDeleteUserAPI = (type: boolean) => {
    return axiosApiInstance({
      method: 'DELETE',
      url: `${DELETE_PROFILE}?confirm=${type}`,
    });
  };

  const displayAlert = (obj: any) => {
    return showAlert({
      icon: {
        size: 70,
        name: IconName.Warning,
        color: BaseColor.redColor,
      },
      title: 'Account Deletion',
      message: `If you choose to delete your account, Your ${obj.businessesCount} businesses and ${obj.reviewsCount} Reviews along with your account will be deleted permanently.`,
      btn: {
        confirmBtnTitle: 'Delete',
        cancelBtnTitle: 'Cancel',
      },
      type: 'Standard',
    });
  };

  const DeleteUserAccount = () => {
    fetchDeleteUserAPI(true)
      .then(async () => {
        //TODO: Will fix once we remove the redux from project.
        dispatch(AuthActions.authentication(false));
        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMark,
            color: colors.primary,
          },
          message:
            'You have successfully deleted your account permanently, Returning you to dashboard.',
          dismissAfterMs: 2000,
        });
      })
      .catch(({ e }) => {
        handleError(e.data);
      });
  };

  return useMutation<{ type: any }, Error, DeleteMutationVar>(
    ({ type }) => {
      return fetchDeleteUserAPI(type)
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response: any) => {
        if (response.businessesCount === 0 && response.reviewsCount === 0) {
          DeleteUserAccount();
        } else {
          await displayAlert(response).then((type) => {
            if (type === 'confirm') {
              DeleteUserAccount();
            }
          });
        }
      },
    },
  );
};
