import { useMutation } from '@tanstack/react-query';
import { handleError } from '@utils';

import { NOTIFICATIONS_USER_API } from '../../../constants';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const useNotificationUserSave = () => {
  return useMutation<any, Error, any>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: `${NOTIFICATIONS_USER_API}`,
      data: payload,
    })
      .then((response) => console.log(response.data))
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
