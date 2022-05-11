export const mutations = `
  createJoinRequest(forumId: ID!): ForumJoinRequest
  acceptJoinRequest(forumJoinRequestId: ID!): ForumJoinRequest
  declineJoinRequest(forumJoinRequestId: ID!): ForumJoinRequest
`;
