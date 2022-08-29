import { useQuery } from '@tanstack/react-query';

import { handleError } from '@utils';

import axios from 'axios';
import Config from 'react-native-config';
import { CategoryPresentable } from '@screens/dashboard/models/CategoryPresentable';

export const useCategories = (
  key: Array<string | number>,
  payload?: Record<string, any>,
  options: any = { enabled: true },
) => {
  let queryParams = '';
  if (payload) {
    queryParams = `?${new URLSearchParams(payload).toString()}`;
  }
  return useQuery(
    key,
    (): Promise<CategoryPresentable[]> => {
      return axios
        .get(`${Config.API_URL}/categories`, {
          params: queryParams,
        })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      ...options,
    },
  );
};
