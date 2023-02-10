import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';
import { DELETE } from '../../constants';
import axiosApiInstance from '../../interceptor/axios-interceptor';

export interface DeleteImagePayload {
  pathname: string;
}

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
