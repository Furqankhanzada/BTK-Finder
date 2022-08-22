import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

import { buildContactItems } from '@screens/businesses/builders/contactItems';
import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import { BusinessPresentable } from '../models/BusinessPresentable';
import Config from 'react-native-config';
import {
  Maybe,
  QueryTagsArgs,
  SortOrder,
  TagConnection,
  TagSortByField,
} from '../../../models/graphql';
import { buildTags } from '@screens/businesses/builders/tags';

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
          shopId: 'cmVhY3Rpb24vc2hvcDpGN2ZrM3plR3o4anpXaWZzQQ==',
          sortOrder: SortOrder.Asc,
          sortBy: TagSortByField.CreatedAt,
        },
        document: gql`
          query getTags(
            $shopId: ID!
            $filter: String
            $first: ConnectionLimitInt
            $last: ConnectionLimitInt
            $before: ConnectionCursor
            $after: ConnectionCursor
            $sortBy: TagSortByField
            $sortOrder: SortOrder
          ) {
            tags(
              shopId: $shopId
              filter: $filter
              first: $first
              last: $last
              before: $before
              after: $after
              shouldIncludeInvisible: true
              sortBy: $sortBy
              sortOrder: $sortOrder
            ) {
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
                __typename
              }
              nodes {
                _id
                displayTitle
                position
                name
                slug
                isVisible
                heroMediaUrl
                metafields {
                  description
                  key
                  namespace
                  scope
                  value
                  valueType
                  __typename
                }
                __typename
              }
              __typename
            }
          }
        `,
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
