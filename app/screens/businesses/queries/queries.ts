import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

import { buildContactItems } from '@screens/businesses/builders/contactItems';
import { handleError } from '@utils';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import { BUSINESSES_API } from '../../../constants';
import { BusinessPresentable } from '../models/BusinessPresentable';
import Config from 'react-native-config';
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
import { buildTags } from '@screens/businesses/builders/tags';
import { buildProducts } from '@screens/businesses/builders/products';

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
        document: gql`
          query catalogItemsQuery(
            $shopIds: [ID!]!
            $tagIds: [ID]
            $first: ConnectionLimitInt
            $last: ConnectionLimitInt
            $before: ConnectionCursor
            $after: ConnectionCursor
            $sortBy: CatalogItemSortByField
            $sortByPriceCurrencyCode: String
            $sortOrder: SortOrder
          ) {
            catalogItems(
              shopIds: $shopIds
              tagIds: $tagIds
              first: $first
              last: $last
              before: $before
              after: $after
              sortBy: $sortBy
              sortByPriceCurrencyCode: $sortByPriceCurrencyCode
              sortOrder: $sortOrder
            ) {
              totalCount
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
                __typename
              }
              edges {
                cursor
                node {
                  _id
                  ... on CatalogItemProduct {
                    product {
                      variants {
                        title
                        optionTitle
                        pricing {
                          displayPrice
                        }
                      }
                      tagIds
                      tags {
                        nodes {
                          _id
                          displayTitle
                          position
                        }
                      }
                      _id
                      title
                      description
                      isLowQuantity
                      isSoldOut
                      isBackorder
                      shop {
                        currency {
                          code
                          __typename
                        }
                        __typename
                      }
                      pricing {
                        compareAtPrice {
                          displayAmount
                          __typename
                        }
                        currency {
                          code
                          __typename
                        }
                        displayPrice
                        minPrice
                        maxPrice
                        __typename
                      }
                      primaryImage {
                        URLs {
                          thumbnail
                          small
                          medium
                          large
                          __typename
                        }
                        __typename
                      }
                      __typename
                    }
                    __typename
                  }
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
      enabled: !!shopId && !!tagId,
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        return buildProducts(data.catalogItems);
      },
    },
  );
};
