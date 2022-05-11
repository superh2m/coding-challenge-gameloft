import { gql } from 'apollo-server-core';

export const types = gql `
  type ForumMessage {
    id: ID!
    content: String!
    forum: Forum!
    forumUser: ForumUser!
    sendedAt: Date!
  }
`;
