import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError, socket } from '@utils';

import { NOTIFICATIONS_USER_API, UPLOAD } from '../../../constants';
import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { NotificationPresentable } from '../models/NotificationPresentable';

interface NotificationUsersPayload {
  read: boolean;
  notificationId: string;
  deviceUniqueId: string;
}

interface NotificationUsersResponse {
  _id: string;
  read: boolean;
  notificationId: string;
  deviceUniqueId: string;
  userId?: string;
}

export interface UploadNotificationImagePayload {
  form: any;
}

export type UploadNotificationImageResponse = {
  Location: string;
  key: string;
};

type NotificationPayload = Pick<
  NotificationPresentable,
  'title' | 'description' | 'link' | 'image' | 'type'
>;

export const useCreateNotification = () => {
  return useMutation<NotificationPresentable, Error, NotificationPayload>(
    async (payload) => {
      return new Promise((resolve, reject) => {
        socket.emit('createNotification', payload, (response: any) => {
          if (response?.errors) {
            handleError(response);
            reject(response);
          } else {
            resolve(response);
          }
        });
      });
    },
  );
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NotificationUsersResponse,
    Error,
    NotificationUsersPayload
  >((payload) => {
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

export const useUploadNotificationImage = () => {
  return useMutation<
    UploadNotificationImageResponse,
    Error,
    UploadNotificationImagePayload
  >((payload) => {
    return axiosApiInstance
      .post(`${UPLOAD}?folder=notifications`, payload.form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
