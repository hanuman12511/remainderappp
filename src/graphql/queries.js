/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBid = /* GraphQL */ `
  query GetBid($id: ID!) {
    getBid(id: $id) {
      id
      price
      auctionId
      userId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listBids = /* GraphQL */ `
  query ListBids(
    $filter: ModelBidFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBids(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        price
        auctionId
        userId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncBids = /* GraphQL */ `
  query SyncBids(
    $filter: ModelBidFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBids(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        price
        auctionId
        userId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
