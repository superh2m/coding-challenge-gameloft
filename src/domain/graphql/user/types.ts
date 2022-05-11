import { gql } from 'apollo-server-core';

export const types = gql `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    picture: String
  }
`;
