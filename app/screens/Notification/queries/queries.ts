import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { handleError, socket } from '@utils';
import { NOTIFICATIONS_API } from '../../../constants';
import { NotificationPresentable } from '../models/NotificationPresentable';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const useNotificationSubscription = () => {
  const queryClient = useQueryClient();
  React.useEffect(() => {
    console.log('@Subscribe Notifications');
    socket.on('notification', () => {
      console.log('on notification listener');
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-count']);
    });
  }, [queryClient]);
};

export const useNotifications = (key: Array<string | number>, params: any) =>
  useQuery(
    key,
    (): Promise<NotificationPresentable[]> => {
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
