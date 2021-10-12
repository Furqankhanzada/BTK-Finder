import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql(`
query catalogItemsQuery($shopId: ID!, $tagIds: [ID] $first: ConnectionLimitInt, $last:  ConnectionLimitInt, $before: ConnectionCursor, $after: ConnectionCursor, $sortBy: CatalogItemSortByField, $sortByPriceCurrencyCode: String, $sortOrder: SortOrder, $offset: Int) {
  catalogItems(shopIds: [$shopId], tagIds: $tagIds, first: $first, last: $last, before: $before, after: $after, sortBy: $sortBy, sortByPriceCurrencyCode: $sortByPriceCurrencyCode, sortOrder: $sortOrder, offset: $offset) {
    totalCount
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        _id
        ... on CatalogItemProduct {
          product {
            _id
            title
            slug
            description
            vendor
            isLowQuantity
            isSoldOut
            isBackorder
            metafields {
              description
              key
              namespace
              scope
              value
              valueType
            }
            shop {
              currency {
                code
              }
            }
            pricing {
              compareAtPrice {
                displayAmount
              }
              currency {
                code
              }
              displayPrice
              minPrice
              maxPrice
            }
            primaryImage {
              URLs {
                thumbnail
                small
                medium
                large
              }
            }
          }
        }
      }
    }
  }
}
`);
