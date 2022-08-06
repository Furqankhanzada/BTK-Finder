import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql(`
query catalogItemsQuery($shopIds: [ID!]!, $tagIds: [ID], $first: ConnectionLimitInt, $last: ConnectionLimitInt, $before: ConnectionCursor, $after: ConnectionCursor, $sortBy: CatalogItemSortByField, $sortByPriceCurrencyCode: String, $sortOrder: SortOrder) {
  catalogItems(shopIds: $shopIds, tagIds: $tagIds, first: $first, last: $last, before: $before, after: $after, sortBy: $sortBy, sortByPriceCurrencyCode: $sortByPriceCurrencyCode, sortOrder: $sortOrder) {
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
`);
