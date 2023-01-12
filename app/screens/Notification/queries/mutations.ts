import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@utils';

import { NOTIFICATIONS_USER_API } from '../../../constants';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

interface NotificationUsersPayload {
  read: boolean;
  notificationId: string;
  deviceUniqueId: string;
}

export const useNotificationUserSave = () => {
  const queryClient = useQueryClient();

  return useMutation<NotificationUsersPayload, Error, any>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: `${NOTIFICATIONS_USER_API}`,
      data: payload,
    })
      .then((response) => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications-count']);
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
