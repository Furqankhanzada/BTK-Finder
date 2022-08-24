import { gql } from 'graphql-request';

export const GET_TAGS = gql`
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
`;

export const GET_PRODUCTS = gql`
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
              _id
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
`;
