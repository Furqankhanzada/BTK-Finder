import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { DEVICES_API } from '../../../constants';

type DevicePresentable = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  deviceUniqueId: string;
  fcmToken: string;
  os: string;
  osVersion: string;
};

type DevicePayload = Pick<
  DevicePresentable,
  'deviceUniqueId' | 'fcmToken' | 'os' | 'osVersion' | 'userId'
>;

export const useDeviceRegisteration = () => {
  return useMutation<DevicePresentable, Error, DevicePayload>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: `${DEVICES_API}`,
      data: payload,
    })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
