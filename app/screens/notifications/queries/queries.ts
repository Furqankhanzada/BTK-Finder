import { useQuery } from '@tanstack/react-query';

import { handleError } from '@utils';

import { NOTIFICATIONS_API } from '../../../constants';
import {
  NotificationCountPresentable,
  NotificationPresentable,
} from '../models/NotificationPresentable';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

interface NotificationsParams {
  deviceUniqueId: string;
  recent?: boolean;
  unreadCount?: boolean;
}

export const useNotifications = (
  key: Array<string | number>,
  params: NotificationsParams,
) =>
  useQuery(
    key,
    (): Promise<NotificationPresentable[] | NotificationCountPresentable> => {
      return axiosApiInstance({
        method: 'GET',
        url: `${NOTIFICATIONS_API}`,
        params: params,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      select: (data) => {
        return data;
      },
    },
  );

export const useNotification = (id: string) =>
  useQuery(
    ['notifications', id],
    (): Promise<NotificationPresentable> => {
      return axiosApiInstance({
        method: 'GET',
        url: `${NOTIFICATIONS_API}/${id}`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      enabled: !!id,
      select: (data) => {
        return data;
      },
    },
  );
