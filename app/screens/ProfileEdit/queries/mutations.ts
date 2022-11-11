import { useMutation } from '@tanstack/react-query';
import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DELETE_PROFILE } from '../../../constants';
import { useAlerts } from '@hooks';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import { BaseColor, useTheme } from '@config';
import { useDispatch } from 'react-redux';
import { AuthActions } from '@actions';

export interface DeleteMutationVar {
  type: boolean;
}

export const useDeleteUserAccount = () => {
  const { showAlert } = useAlerts();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  return useMutation<{ type: any }, Error, DeleteMutationVar>(
    ({ type }) => {
      return axiosApiInstance({
        method: 'DELETE',
        url: `${DELETE_PROFILE}?confirm=${type}`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      onSuccess: async (response: any) => {
        await showAlert({
          icon: {
            size: 70,
            name: IconName.Warning,
            color: BaseColor.redColor,
          },
          title: 'Account Deletion',
          message: `If you choose to delete your account, Your ${response.businessesCount} businesses and ${response.reviewsCount} Reviews along with your account will be deleted permanently.`,
          btn: {
            confirmBtnTitle: 'Yes',
            cancelBtnTitle: 'Cancel',
          },
          type: 'Standard',
        }).then((type) => {
          if (type === 'confirm') {
            axiosApiInstance({
              method: 'DELETE',
              url: `${DELETE_PROFILE}?confirm=true`,
            })
              .then(async () => {
                dispatch(AuthActions.authentication(false));
                await showAlert({
                  icon: {
                    size: 70,
                    name: IconName.CheckMark,
                    color: colors.primary,
                  },
                  title: 'Account Deleted Successfully',
                  message:
                    'You have successfully deleted your account permanently.',
                  btn: {
                    confirmBtnTitle: 'Ok',
                  },
                  type: 'Standard',
                });
              })
              .catch(({ e }) => {
                handleError(e.data);
              });
          }
        });
      },
    },
  );
};
