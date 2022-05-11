import { User } from './user';
import { Forum } from './forum';
import { ForumUser } from './forumUser';
import { ForumJoinRequest } from './forumJoinRequest';
import { ForumMessage } from './forumMessage';

const resolvers = {
  Query: {
    ...User.resolvers.queries,
    ...Forum.resolvers.queries,
    ...ForumUser.resolvers.queries,
    ...ForumJoinRequest.resolvers.queries,
    ...ForumMessage.resolvers.queries,
  },
  Mutation: {
    ...User.resolvers.mutations,
    ...Forum.resolvers.mutations,
    ...ForumUser.resolvers.mutations,
    ...ForumJoinRequest.resolvers.mutations,
    ...ForumMessage.resolvers.mutations,
  }
};

export default resolvers;
