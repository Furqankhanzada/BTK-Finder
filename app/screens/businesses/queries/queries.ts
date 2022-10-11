import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
import {
  BusinessParams,
  BusinessParamsWithSearch,
} from '@screens/businesses/models/BusinessParams';

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
  params?: BusinessParams,
  options = { enabled: true },
) => {
  return useQuery(
    key,
    (): Promise<BusinessPresentable[]> => {
      return axiosApiInstance({
        method: 'GET',
        url: `${BUSINESSES_API}`,
        params: params,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      ...options,
      select: (businesses) => {
        return businesses.map((business) => {
          if (business.favorites && business.favorites.length) {
            return business;
          } else {
            return { ...business, favorites: [] };
          }
        });
      },
    },
  );
};

export const useBusinessesInfinite = (
  key: Array<string | number>,
  params: BusinessParamsWithSearch,
) => {
  const { isFiltering, ...restParams } = params;
  return useInfiniteQuery(
    key,
    ({ pageParam = 1 }): Promise<BusinessPresentable[]> => {
      const skip = (pageParam - 1) * params.limit!;

      return axiosApiInstance({
        method: 'GET',
        url: `${BUSINESSES_API}`,
        params: {
          ...restParams,
          skip: skip >= 0 ? skip : 0,
        },
      })
        .then((response) => {
          return response.data.map((business: BusinessPresentable) => {
            if (business.favorites && business.favorites.length) {
              return business;
            } else {
              return { ...business, favorites: [] };
            }
          });
        })
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      getNextPageParam: (lastPageBusinesses, allPages) => {
        allPages = allPages.filter((page) => page?.length);

        if (lastPageBusinesses.length) {
          return allPages.length + 1;
        }
      },
      ...(isFiltering ? { staleTime: 0, cacheTime: 0 } : {}),
    },
  );
};

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
