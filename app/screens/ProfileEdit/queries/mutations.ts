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
  const { showAlert } = useAlerts();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const fetchDeleteUserAPI = (type: boolean) => {
    return axiosApiInstance({
      method: 'DELETE',
      url: `${DELETE_PROFILE}?confirm=${type}`,
    });
  };

  const displayAlert = (obj: any, warning: boolean) => {
    return showAlert({
      icon: {
        size: 70,
        name: warning ? IconName.Warning : IconName.CheckMark,
        color: warning ? BaseColor.redColor : colors.primary,
      },
      title: warning ? 'Account Deletion' : 'Account Deleted Successfully',
      message: warning
        ? `If you choose to delete your account, Your ${obj.businessesCount} businesses and ${obj.reviewsCount} Reviews along with your account will be deleted permanently.`
        : 'You have successfully deleted your account permanently.',
      btn: warning
        ? {
            confirmBtnTitle: 'Delete',
            cancelBtnTitle: 'Cancel',
          }
        : {
            confirmBtnTitle: 'Ok',
          },
      type: 'Standard',
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
        await displayAlert(response, true).then((type) => {
          if (type === 'confirm') {
            fetchDeleteUserAPI(true)
              .then(async () => {
                //TODO: Will fix once we remove the redux from project.
                dispatch(AuthActions.authentication(false));
                await displayAlert({}, false);
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
