import { gql } from 'apollo-server-express';
import { User } from './user';
import { Forum } from './forum';
import { ForumUser } from './forumUser';
import { ForumJoinRequest } from './forumJoinRequest';
import { ForumMessage } from './forumMessage';

const typeDefs = gql`
  scalar Date

  ${User.types}
  ${Forum.types}
  ${ForumUser.types}
  ${ForumJoinRequest.types}
  ${ForumMessage.types}
  
  type Query {
    ${User.queries}
    ${Forum.queries}
    ${ForumUser.queries}
    ${ForumJoinRequest.queries}
    ${ForumMessage.queries}
  }
  
  type Mutation {
    ${User.mutations}
    ${Forum.mutations}
    ${ForumUser.mutations}
    ${ForumJoinRequest.mutations}
    ${ForumMessage.mutations}
  }
`;

export default typeDefs;
