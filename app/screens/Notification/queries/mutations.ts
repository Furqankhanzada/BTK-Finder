import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError, socket } from '@utils';

import {
  NOTIFICATIONS_USER_API,
  UPLOAD_NOTIFICATION,
} from '../../../constants';
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

export interface UploadProfileImagePayload {
  form: any;
}

export type UploadProfileImageResponse = {
  Location: string;
};

type NotificationPayload = Pick<
  NotificationPresentable,
  'title' | 'description' | 'link' | 'image' | 'type'
>;

export const useCreateNotification = () => {
  const navigation = useNavigation();
  return useMutation<NotificationPresentable, Error, NotificationPayload>(
    (payload) => {
      return socket.emit('createNotification', payload, (response: any) => {
        if (response?.errors) {
          handleError(response);
        } else {
          navigation.goBack();
          return response;
        }
      });
    },
  );
};

export const useNotificationUserSave = () => {
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
    UploadProfileImageResponse,
    Error,
    UploadProfileImagePayload
  >((payload) => {
    return axiosApiInstance
      .post(`${UPLOAD_NOTIFICATION}/notification`, payload.form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
