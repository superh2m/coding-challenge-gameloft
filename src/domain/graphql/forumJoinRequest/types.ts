import { gql } from 'apollo-server-core';

export const types = gql `
  type ForumJoinRequest {
    id: ID!
    isAccepted: Boolean
    user: User!
    forum: Forum!
  }
`;
