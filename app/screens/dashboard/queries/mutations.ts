import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';

import { DEVICES_API } from '../../../constants';
import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const useDeviceRegisteration = () => {
  return useMutation<any, Error, any>((payload) => {
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
