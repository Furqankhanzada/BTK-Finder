import { useQuery } from '@tanstack/react-query';
import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import { handleError } from '@utils';

export const useBusiness = (id: string) =>
  useQuery(['business', id], () => {
    return axiosApiInstance({
      method: 'GET',
      url: `${BUSINESSES_API}/${id}`,
    })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
