export const queries = `
  forums(q: String): [Forum]
  forum(id: ID!): Forum
  myForums: [Forum]
`;
