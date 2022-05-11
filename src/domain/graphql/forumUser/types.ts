import { gql } from 'apollo-server-core';

export const types = gql `
  type ForumUser {
    id: ID!
    role: String!
    user: User!
    forum: Forum!
  }
`;
