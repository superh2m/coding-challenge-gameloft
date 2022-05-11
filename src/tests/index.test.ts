/* eslint @typescript-eslint/no-unsafe-member-access: "off" */
import App, { IApp } from '../app/app';
import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { IForum } from '../domain/document/forum';
import mongoose from 'mongoose';
import { IUser } from '../domain/document/user';
import { Authenticator } from '../app/dev/authenticator';
import { GraphQLResponse } from 'apollo-server-core';
import { IForumJoinRequest } from '../domain/document/forumJoinRequest';

describe('GraphQL', () => {
  let testApp: IApp;

  before(async () => {
    testApp = await App();
  });

  after(async () => {
    await testApp.graphqlServer.stop();
    await testApp.dbConnection.close();
    testApp.httpServer.close();
  });

  describe('Forum', () => {
    it('Query forums(q: String)', async () => {
      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumsQuery($q: String) {
                    forums(q: $q) {
                        id
                        name
                        isPrivate
                    }
                }`,
        variables: { q: '' },
      });
    
      expect(result.data.forums.length).eq(4);
    });

    it('Query forums(q: String) with specific result', async () => {
      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumsQuery($q: String) {
                    forums(q: $q) {
                        id
                        name
                        isPrivate
                    }
                }`,
        variables: { q: 'SongPop 3' },
      });
    
      expect(result.data.forums.length).eq(1);
      expect(result.data.forums[0]).has.keys('id', 'name', 'isPrivate');
      expect(result.data.forums[0].name).eq('SongPop 3');
    });

    it('Query forums(q: String) without result', async () => {
      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumsQuery($q: String) {
                    forums(q: $q) {
                        id
                        name
                        isPrivate
                    }
                }`,
        variables: { q: 'InexistingForum 1' },
      });
    
      expect(result.data.forums.length).eq(0);
    });

    it('Query forum(id: ID!) with specific result', async () => {
      const newForum: IForum = await createRandomForum();

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumQuery($id: ID!) {
                    forum(id: $id) {
                        id
                        name
                        isPrivate
                    }
                }`,
        variables: { id: newForum.id },
      });
    
      expect(result.data.forum).to.not.be.null;
      expect(result.data.forum).has.keys('id', 'name', 'isPrivate');
      expect(result.data.forum.name).eq(newForum.name);
      expect(result.data.forum.isPrivate).eq(newForum.isPrivate);
    });
        
    it('Query forum(id: ID!) without result', async () => {
      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumQuery($id: ID!) {
                    forum(id: $id) {
                        id
                        name
                        isPrivate
                    }
                }`,
        variables: { id: 'Inexisting Forum ID' },
      });
    
      expect(result.data.forum).to.be.null;
    });

    it('Query myForums', async () => {
      const newForum: IForum = await createRandomForum();

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query MyForumsQuery {
                    myForums {
                        id
                        name
                        isPrivate
                    }
                }`
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const length: number = result.data.myForums.length;
    
      expect(length).at.least(1);
      expect(result.data.myForums[length - 1].name).eq(newForum.name);
    });

    it('Mutation createForum(name: String!, isPrivate: Boolean!)', async () => {
      const name: string = 'Random Forum #' + (new mongoose.Types.ObjectId()).toString();
      const isPrivate: boolean = Math.random() < 0.5;

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation CreateForumMutation($name: String!, $isPrivate: Boolean!) {
                    createForum(name: $name, isPrivate: $isPrivate) {
                        id
                        name
                        isPrivate
                    }
                }`,
        variables: { name, isPrivate },
      });
    
      expect(result.data.createForum).to.not.be.null;
      expect(result.data.createForum).has.keys('id', 'name', 'isPrivate');
      expect(result.data.createForum.name).eq(name);
      expect(result.data.createForum.isPrivate).eq(isPrivate);
    });
  });

  describe('User', () => {
    it('Query user(id: String!) with specific result', async () => {
      const testUser: IUser = await Authenticator.getDefaultUser();

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query UserQuery($id: ID!) {
                    user(id: $id) {
                        id
                        firstName
                        lastName
                        email
                        picture
                    }
                }`,
        variables: { id: testUser.id },
      });

      expect(result.data.user).to.not.be.null;
      expect(result.data.user).has.keys('id', 'firstName', 'lastName', 'email', 'picture');
      expect(result.data.user.id).eq(testUser.id);
      expect(result.data.user.firstName).eq(testUser.firstName);
      expect(result.data.user.lastName).eq(testUser.lastName);
      expect(result.data.user.email).eq(testUser.email);
      expect(result.data.user.picture).eq(testUser.picture);
    });
        
    it('Query user(id: String!) without result', async () => {
      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query UserQuery($id: ID!) {
                    user(id: $id) {
                        id
                        firstName
                        lastName
                        email
                        picture
                    }
                }`,
        variables: { id: 'Inexisting User ID' },
      });
    
      expect(result.data.user).to.be.null;
    });

    it('Mutation updateProfile(firstName: String!, lastName: String!, picture: String)', async () => {
      const testUser: IUser = await Authenticator.getDefaultUser();
      const firstName = 'Canadian Hama';
      const lastName = 'Mohamed Mahmoud at Gameloft is happy';
      const picture = 'https://i.giphy.com/media/VbEC9WchxkiWTL5PFo/giphy.webp';

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation UpdateProfileMutation($firstName: String!, $lastName: String!, $picture: String) {
                    updateProfile(firstName: $firstName, lastName: $lastName, picture: $picture) {
                        id
                        firstName
                        lastName
                        email
                        picture
                    }
                }`,
        variables: { firstName, lastName, picture },
      });
    
      expect(result.data.updateProfile).to.not.be.null;
      expect(result.data.updateProfile).has.keys('id', 'firstName', 'lastName', 'email', 'picture');
      expect(result.data.updateProfile.firstName).eq(testUser.firstName);
      expect(result.data.updateProfile.lastName).eq(testUser.lastName);
      expect(result.data.updateProfile.picture).eq(testUser.picture);
    });
  });

  describe('ForumUser', () => {
    it('Query forumUsers(forumId: ID!)', async () => {
      const forum: IForum = await getForum('SongPop 3');

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumUsersQuery($forumId: ID!) {
                    forumUsers(forumId: $forumId) {
                        id
                        role
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        forum {
                            id
                            isPrivate
                            name
                        }
                    }
                }`,
        variables: { forumId: forum.id },
      });
    
      expect(result.data.forumUsers.length).eq(4);
      expect(result.data.forumUsers[0]).has.keys('id', 'role', 'user', 'forum');
    });

    it('Query forumUsers(forumId: ID!) without result', async () => {
      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumUsersQuery($forumId: ID!) {
                    forumUsers(forumId: $forumId) {
                        id
                        role
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        forum {
                            id
                            isPrivate
                            name
                        }
                    }
                }`,
        variables: { forumId: 'InexistingForum-ID' },
      });
    
      expect(result.data.forumUsers).to.be.null;
    });
  });

  describe('ForumJoinRequest', () => {
    it('Query forumJoinRequests(forumId: ID!)', async () => {
      const testUser: IUser = await Authenticator.getDefaultUser();
      const forumJoinRequest: IForumJoinRequest = await createForumJoinRequest('SongPop 2');

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumJoinRequestsQuery($forumId: ID!) {
                    forumJoinRequests(forumId: $forumId) {
                        id
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        isAccepted
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: forumJoinRequest.forum.id },
      });
    
      expect(result.data.forumJoinRequests.length).eq(1);
      expect(result.data.forumJoinRequests[0]).has.keys('id', 'user', 'isAccepted', 'forum');
      expect(result.data.forumJoinRequests[0].id).eq(forumJoinRequest.id);
      expect(result.data.forumJoinRequests[0].user.id).eq(testUser.id);
      expect(result.data.forumJoinRequests[0].forum.id).eq(forumJoinRequest.forum.id);
    });

    it('Query forumJoinRequests(forumId: ID!) without result', async () => {
      const newForum: IForum = await createRandomForum();

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumJoinRequestsQuery($forumId: ID!) {
                    forumJoinRequests(forumId: $forumId) {
                        id
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        isAccepted
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: newForum.id },
      });
    
      expect(result.data.forumJoinRequests.length).eq(0);
    });

    it('Mutation createJoinRequest(forumId: ID!)', async () => {
      const forum: IForum = await getForum('SongPop 3');
      const testUser: IUser = await Authenticator.getDefaultUser();

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation CreateForumJoinRequestMutation($forumId: ID!) {
                    createJoinRequest(forumId: $forumId) {
                        id
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        isAccepted
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: forum.id },
      });

      expect(result.data.createJoinRequest).to.not.be.null;
      expect(result.data.createJoinRequest).has.keys('id', 'user', 'isAccepted', 'forum');
      expect(result.data.createJoinRequest.isAccepted).to.be.null;
      expect(result.data.createJoinRequest.user.id).eq(testUser.id);
      expect(result.data.createJoinRequest.forum.id).eq(forum.id);
    });

    it('Mutation acceptJoinRequest(forumJoinRequestId: ID!) && Query forumUsers(forumId: ID!)', async () => {
      const testUser: IUser = await Authenticator.getDefaultUser();
      const forumJoinRequest: IForumJoinRequest = await createForumJoinRequest('SongPop 4');

      const resultMutation: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation AcceptJoinRequestMutation($forumJoinRequestId: ID!) {
                    acceptJoinRequest(forumJoinRequestId: $forumJoinRequestId) {
                        id
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        isAccepted
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumJoinRequestId: forumJoinRequest.id },
      });

      expect(resultMutation.data.acceptJoinRequest).to.not.be.null;
      expect(resultMutation.data.acceptJoinRequest).has.keys('id', 'user', 'isAccepted', 'forum');
      expect(resultMutation.data.acceptJoinRequest.id).eq(forumJoinRequest.id);
      expect(resultMutation.data.acceptJoinRequest.isAccepted).to.be.true;
      expect(resultMutation.data.acceptJoinRequest.user.id).eq(testUser.id);
      expect(resultMutation.data.acceptJoinRequest.forum.id).eq(forumJoinRequest.forum.id);

      const resultQuery: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumUsersQuery($forumId: ID!) {
                    forumUsers(forumId: $forumId) {
                        id
                        role
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        forum {
                            id
                            isPrivate
                            name
                        }
                    }
                }`,
        variables: { forumId: forumJoinRequest.forum.id },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const length: number = resultQuery.data.forumUsers.length;

      expect(length).at.least(1);
      expect(resultQuery.data.forumUsers[length - 1].user.id).eq(testUser.id);
    });

    it('Mutation declineJoinRequest(forumJoinRequestId: ID!)', async () => {
      const testUser: IUser = await Authenticator.getDefaultUser();
      const forumJoinRequest: IForumJoinRequest = await createForumJoinRequest('SongPop 5');

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation DeclineJoinRequestMutation($forumJoinRequestId: ID!) {
                    declineJoinRequest(forumJoinRequestId: $forumJoinRequestId) {
                        id
                        user {
                            id
                            firstName
                            lastName
                            picture
                            email
                        }
                        isAccepted
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumJoinRequestId: forumJoinRequest.id },
      });

      expect(result.data.declineJoinRequest).to.not.be.null;
      expect(result.data.declineJoinRequest).has.keys('id', 'user', 'isAccepted', 'forum');
      expect(result.data.declineJoinRequest.id).eq(forumJoinRequest.id);
      expect(result.data.declineJoinRequest.isAccepted).to.be.false;
      expect(result.data.declineJoinRequest.user.id).eq(testUser.id);
      expect(result.data.declineJoinRequest.forum.id).eq(forumJoinRequest.forum.id);
    });
  });

  describe('ForumMessage', () => {
    it('Query forumMessages(forumId: ID!)', async () => {
      const forum: IForum = await getForum('SongPop 3');

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumMessagesQuery($forumId: ID!) {
                    forumMessages(forumId: $forumId) {
                        id
                        content
                        sendedAt
                        forumUser {
                            id
                            user {
                                id
                                firstName
                                email
                                lastName
                                picture
                            }
                            role
                        }
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: forum.id },
      });
    
      expect(result.data.forumMessages.length).eq(5);
      expect(result.data.forumMessages[0]).has.keys('id', 'content', 'sendedAt', 'forumUser', 'forum');
      expect(result.data.forumMessages[0].forumUser.user).has.keys('id', 'firstName', 'email', 'lastName', 'picture');
    });

    it('Query forumMessages(forumId: ID!) without result', async () => {
      const forum: IForum = await getForum('SongPop 4');

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `query ForumMessagesQuery($forumId: ID!) {
                    forumMessages(forumId: $forumId) {
                        id
                        content
                        sendedAt
                        forumUser {
                            id
                            user {
                                id
                                firstName
                                email
                                lastName
                                picture
                            }
                            role
                        }
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: forum.id },
      });
    
      expect(result.data.forumMessages.length).eq(0);
    });

    it('Mutation postMessage(forumId: ID!, content: String!)', async () => {
      const testUser: IUser = await Authenticator.getDefaultUser();
      const newForum: IForum = await createRandomForum();
      const content = 'Hello World!';

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation PostMessageMutation($forumId: ID!, $content: String!) {
                    postMessage(forumId: $forumId, content: $content) {
                        id
                        content
                        sendedAt
                        forumUser {
                            id
                            user {
                                id
                                firstName
                                email
                                lastName
                                picture
                            }
                            role
                        }
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: newForum.id, content },
      });

      expect(result.data.postMessage).to.not.be.null;
      expect(result.data.postMessage).has.keys('id', 'content', 'sendedAt', 'forumUser', 'forum');
      expect(result.data.postMessage.content).eq(content);
      expect(result.data.postMessage.forum.id).eq(newForum.id);
      expect(result.data.postMessage.forumUser.user.id).eq(testUser.id);
    });

    it('Mutation postMessage(forumId: ID!, content: String!) forbidden', async () => {
      const forum: IForum = await getForum('SongPop 5');

      const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
        query: gql `mutation PostMessageMutation($forumId: ID!, $content: String!) {
                    postMessage(forumId: $forumId, content: $content) {
                        id
                        content
                        sendedAt
                        forumUser {
                            id
                            user {
                                id
                                firstName
                                email
                                lastName
                                picture
                            }
                            role
                        }
                        forum {
                            id
                            name
                            isPrivate
                        }
                    }
                }`,
        variables: { forumId: forum.id, content: 'Hello World!' },
      });

      expect(result.data.postMessage).to.be.null;
      expect(result.errors.length).eq(1);
      expect(result.errors[0].message).eq('User not allowed to post on this forum');
    });
  });

  const getForum = async (name: string): Promise<IForum> => {
    const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
      query: gql `query ForumsQuery($q: String) {
                forums(q: $q) {
                    id
                    name
                    isPrivate
                }
            }`,
      variables: { q: name },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data.forums[0];
  };

  const createRandomForum = async (isPrivate = false): Promise<IForum> => {
    const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
      query: gql `mutation CreateForumMutation($name: String!, $isPrivate: Boolean!) {
                createForum(name: $name, isPrivate: $isPrivate) {
                    id
                    name
                    isPrivate
                }
            }`,
      variables: { name: 'Random Forum #' + (new mongoose.Types.ObjectId()).toString(), isPrivate },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data.createForum;
  };

  const createForumJoinRequest = async (forumName: string): Promise<IForumJoinRequest> => {
    const forum: IForum = await getForum(forumName);

    const result: GraphQLResponse = await testApp.graphqlServer.executeOperation({
      query: gql `mutation CreateForumJoinRequestMutation($forumId: ID!) {
                createJoinRequest(forumId: $forumId) {
                    id
                    user {
                    id
                        firstName
                        lastName
                        picture
                        email
                    }
                    isAccepted
                    forum {
                        id
                        name
                        isPrivate
                    }
                }
            }`,
      variables: { forumId: forum.id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data.createJoinRequest;
  };
});
