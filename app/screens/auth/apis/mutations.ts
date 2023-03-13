import { useMutation } from '@tanstack/react-query';
import { handleError } from '@utils';
import { useAlerts } from '@hooks';
import { BaseColor } from '@config';

import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import { SIGNUP } from '../../../constants';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const useRegisterAcctount = () => {
  const { showNotification } = useAlerts();

  return useMutation<any, Error, any>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: SIGNUP,
      data: payload,
    })
      .then((response) => {
        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMarkCircle,
            color: BaseColor.greenColor,
          },
          message: 'You have successfully registered an account, Login Now!',
        });
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
