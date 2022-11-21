import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { handleError } from '@utils';
import { useAlerts } from '@hooks';
import { BaseColor } from '@config';
import { AuthActions } from '@actions';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DELETE_PROFILE } from '../../../constants';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';

export interface DeleteMutationVar {
  confirm: boolean;
}

export interface DeleteUserAccountResponse {
  ownerOfBusinessesCount?: number;
  businessesWhereGaveReviewsCount?: number;
  reviewsOnYourBusinessesCount?: number;
  success?: boolean;
}

export const useDeleteUserAccount = () => {
  const { showAlert, showNotification } = useAlerts();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

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
              name: IconName.CheckMarkCircle,
              color: BaseColor.greenColor,
            },
            message:
              'Your account and all data related to it were deleted permanently.\n\nYou can still use the application and benefit from it. Redirecting to the dashboard.',
            dismissAfterMs: 4000,
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
        if (
          response.ownerOfBusinessesCount === 0 &&
          response.reviewsOnYourBusinessesCount === 0 &&
          response.businessesWhereGaveReviewsCount === 0
        ) {
          deleteUser();
        } else {
          const buttonPressed = await showAlert({
            icon: {
              size: 70,
              name: IconName.Warning,
              color: BaseColor.redColor,
            },
            title: 'Account Deletion',
            message: `You have data associated with your account.\nBy proceeding with the account deletion you will lose all mentioned records.\n${
              response.ownerOfBusinessesCount !== 0
                ? `\n${t('ownerOfBusinessesCount', {
                    count: response.ownerOfBusinessesCount,
                  })}`
                : ''
            }${
              response.reviewsOnYourBusinessesCount !== 0
                ? `\n${t('reviewsOnYourBusinessesCount', {
                    count: response.reviewsOnYourBusinessesCount,
                  })}`
                : ''
            }${
              response.businessesWhereGaveReviewsCount !== 0
                ? `\n${t('businessesWhereGaveReviewsCount', {
                    count: response.businessesWhereGaveReviewsCount,
                  })}`
                : ''
            }\n\nNote: Be careful you won't be able to recover it again.`,
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
