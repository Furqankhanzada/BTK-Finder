import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { handleError } from '@utils';
import { useAlerts } from '@hooks';
import { BaseColor, useTheme } from '@config';
import { AuthActions } from '@actions';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DELETE_PROFILE } from '../../../constants';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';

export interface DeleteMutationVar {
  confirm: boolean;
}

export interface DeleteUserAccountResponse {
  businessesCount?: number;
  reviewsCount?: number;
  success?: boolean;
}

export const useDeleteUserAccount = () => {
  const { showAlert, showNotification } = useAlerts();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const deleteUserAccount = (confirm: boolean) => {
    return axiosApiInstance({
      method: 'DELETE',
      url: `${DELETE_PROFILE}?confirm=${confirm}`,
    });
  };

  const deleteUser = () => {
    deleteUserAccount(true)
      .then(async (response) => {
        if (response.data.success) {
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

          navigation.goBack();

          //TODO: Will fix once we remove the redux from project.
          dispatch(AuthActions.authentication(false));
        }
      })
      .catch(({ e }) => {
        handleError(e.data);
      });
  };

  return useMutation<DeleteUserAccountResponse, Error, DeleteMutationVar>(
    ({ confirm }) => {
      return deleteUserAccount(confirm)
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response) => {
        if (response.businessesCount === 0 && response.reviewsCount === 0) {
          deleteUser();
        } else {
          const buttonPressed = await showAlert({
            icon: {
              size: 70,
              name: IconName.Warning,
              color: BaseColor.redColor,
            },
            title: 'Account Deletion',
            message: `If you choose to delete your account, Your ${response.businessesCount} businesses and ${response.reviewsCount} Reviews along with your account will be deleted permanently.`,
            btn: {
              confirmDestructive: true,
              confirmBtnTitle: 'Delete',
              cancelBtnTitle: 'Cancel',
            },
            type: 'Standard',
          });

          if (buttonPressed === 'confirm') {
            deleteUser();
          }
        }
      },
    },
  );
};
