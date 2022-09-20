import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { GET_CATEGORIES } from '../../../constants';
import { CategoryPresentable } from '../modals/CategoryPresentables';
import { CategoryParams } from '../modals/categoryParams';

export const useCategories = (
  key: Array<string | number>,
  params?: CategoryParams,
  options = { enabled: true },
) => {
  return useQuery(
    key,
    (): Promise<CategoryPresentable[]> => {
      return axios
        .get(GET_CATEGORIES, {
          method: 'GET',
          params,
        })
        .then((responce) => responce.data);
    },
    {
      ...options,
    },
  );
};
