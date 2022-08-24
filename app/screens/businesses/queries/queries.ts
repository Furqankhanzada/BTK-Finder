import { useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';
import Config from 'react-native-config';

import { buildContactItems } from '@screens/businesses/builders/contactItems';
import { handleError } from '@utils';
import { buildTags } from '@screens/businesses/builders/tags';
import { buildProducts } from '@screens/businesses/builders/products';
import {
  GET_PRODUCTS,
  GET_TAGS,
} from '@screens/businesses/queries/gql/queries';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import { BusinessPresentable } from '../models/BusinessPresentable';
import {
  CatalogItemConnection,
  CatalogItemSortByField,
  Maybe,
  QueryCatalogItemsArgs,
  QueryTagsArgs,
  SortOrder,
  TagConnection,
  TagSortByField,
} from '../../../models/graphql';

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

interface GetTags {
  tags: Maybe<TagConnection>;
}

export const useTags = (shopId: string | undefined) => {
  return useQuery(
    ['tags', shopId],
    (): Promise<GetTags> => {
      return request<GetTags, QueryTagsArgs>({
        url: Config.SHOPS_API_URL,
        variables: {
          shopId: shopId!,
          sortOrder: SortOrder.Asc,
          sortBy: TagSortByField.CreatedAt,
        },
        document: GET_TAGS,
      });
    },
    {
      enabled: !!shopId,
      select: (data) => {
        return buildTags(data.tags);
      },
    },
  );
};

type CatalogItems = {
  catalogItems: Maybe<CatalogItemConnection>;
};

export const useProductsByTag = (
  shopId: string | undefined,
  tagId: string | undefined,
) => {
  return useQuery(
    ['products', shopId, tagId],
    (): Promise<CatalogItems> => {
      return request<CatalogItems, QueryCatalogItemsArgs>({
        url: Config.SHOPS_API_URL,
        variables: {
          shopIds: [shopId!],
          tagIds: [tagId!],
          sortOrder: SortOrder.Asc,
          sortBy: CatalogItemSortByField.CreatedAt,
        },
        document: GET_PRODUCTS,
      });
    },
    {
      enabled: !!shopId && !!tagId,
      select: (data) => {
        return buildProducts(data.catalogItems);
      },
    },
  );
};
