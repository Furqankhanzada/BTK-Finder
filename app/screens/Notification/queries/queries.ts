import { useQuery } from '@tanstack/react-query';

import { handleError } from '@utils';
import { NOTIFICATIONS_API } from '../../../constants';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const useGetNotifications = (key: Array<string | number>, params: any) =>
  useQuery(
    key,
    (): Promise<any> => {
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
    (): Promise<any> => {
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