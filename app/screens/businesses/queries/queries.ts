import { useQuery } from '@tanstack/react-query';

import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import { BusinessPresentable } from '../models/BusinessPresentable';
import { buildContactItems } from '@screens/businesses/builders/contactItems';

export const useBusiness = (id: string) =>
  useQuery(
    ['business', id],
    (): Promise<BusinessPresentable> => {
      return axiosApiInstance({
        method: 'GET',
        url: `${BUSINESSES_API}/${id}`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      select: (data) => {
        return { ...data, contactItems: buildContactItems(data) };
      },
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );

export const useBusinesses = (
  key: Array<string | number>,
  payload?: any,
  oprions: any = { enabled: true },
) => {
  let queryParams = '';
  if (payload && encodeQueryData(payload)) {
    queryParams = `?${encodeQueryData(payload)}`;
  }
  return useQuery(
    key,
    () => {
      return axiosApiInstance({
        method: 'GET',
        url: `${BUSINESSES_API}${queryParams}`,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      ...oprions,
    },
  );
};

function encodeQueryData(obj: any, prefix?: any): any {
  let str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p];
      str.push(
        v !== null && typeof v === 'object'
          ? encodeQueryData(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v),
      );
    }
  }
  return str.join('&');
}
