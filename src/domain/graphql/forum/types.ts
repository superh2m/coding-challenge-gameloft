import { gql } from 'apollo-server-core';

export const types = gql `
  type Forum {
    id: ID!
    name: String!
    isPrivate: Boolean!
  }
`;
