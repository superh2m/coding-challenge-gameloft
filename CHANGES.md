I wanted to implement the logic of this second part because I found it funny, I hope you won't mind.

## GraphQL

### Schema

```gql
type Forum {
  ...
  isPrivate: Boolean!
}

type ForumUser {
  ...
  role: String!
}

type ForumJoinRequest {
  id: ID!
  isAccepted: Boolean
  user: User!
  forum: Forum!
}

type Query {
  ...
  forumJoinRequests(forumId: ID!): [ForumJoinRequest]
}

type Mutation {
  ...
  ~~joinForum(forumId: ID!): ForumUser~~
  createForum(name: String!, isPrivate: Boolean!): Forum
  createJoinRequest(forumId: ID!): ForumJoinRequest
  acceptJoinRequest(forumJoinRequestId: ID!): ForumJoinRequest
  declineJoinRequest(forumJoinRequestId: ID!): ForumJoinRequest
}
```
