import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';

import { DELETE, DEVICES_API } from '../constants';
import axiosApiInstance from '../interceptor/axios-interceptor';

export interface DeleteImagePayload {
  pathname: string;
}

type Device = {
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
  Device,
  'deviceUniqueId' | 'fcmToken' | 'os' | 'osVersion' | 'userId'
>;

export const useDeleteImage = () => {
  return useMutation<Object, Error, DeleteImagePayload>((payload) => {
    return axiosApiInstance
      .post(`${DELETE}?pathname=${payload.pathname}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};

export const useDeviceRegistration = () => {
  return useMutation<Device, Error, DevicePayload>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: DEVICES_API,
      data: payload,
    })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
