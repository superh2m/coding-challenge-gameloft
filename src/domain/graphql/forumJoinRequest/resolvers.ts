import { UserInputError } from 'apollo-server-express';
import { HydratedDocument } from 'mongoose';
import { Authenticator } from '../../../app/dev/authenticator';
import { ForumJoinRequest as ForumJoinRequestDocument, IForumJoinRequest as IForumJoinRequestDocument } from '../../document/forumJoinRequest';
import { ForumUser as ForumUserDocument, IForumUser as IForumUserDocument, Role } from '../../document/forumUser';
import { Forum as ForumDocument, IForum as IForumDocument } from '../../document/forum';
import { IUser as IUserDocument } from '../../document/user';

const queries = {
  forumJoinRequests: async (_root: undefined, args: Record<string, string>): Promise<IUserDocument[]> => {
    return await ForumJoinRequestDocument.find({ forum: args.forumId }).populate('user').populate('forum');
  }
};

const mutations = {
  createJoinRequest: async (_root: undefined, args: Record<string, string>): Promise<IForumJoinRequestDocument> => {
    const currentUser: IUserDocument = await Authenticator.getDefaultUser();
    const forum: IForumDocument = await ForumDocument.findById(args.forumId);

    if (forum === null) {
      throw new UserInputError('Forum does not exist');
    }

    const existingRequests: IForumJoinRequestDocument[] = await ForumJoinRequestDocument.find({ forum: forum.id, user: currentUser });
    const existingForumUser: IForumUserDocument = await ForumUserDocument.findOne({ forum: forum.id, user: currentUser });

    if (existingRequests.length !== 0) {
      throw new UserInputError('Multiple requests are not allowed');
    }
    if (existingForumUser !== null) {
      throw new UserInputError('User is already in the forum');
    }

    const forumJoinRequest: HydratedDocument<IForumJoinRequestDocument> = new ForumJoinRequestDocument({
      forum: forum.id,
      user: currentUser
    });

    await forumJoinRequest.save();
    
    return (await forumJoinRequest.populate('forum')).populate('user');
  },

  acceptJoinRequest: async (_root: undefined, args: Record<string, string>): Promise<IForumJoinRequestDocument> => {
    // no user permission check here, in order to facilitate testing this action
    const forumJoinRequest: HydratedDocument<IForumJoinRequestDocument> = await ForumJoinRequestDocument.findById(args.forumJoinRequestId);

    forumJoinRequest.isAccepted = true;

    await forumJoinRequest.save();

    const forumUser: HydratedDocument<IForumUserDocument> = new ForumUserDocument({
      role: Role.PARTICIPANT,
      user: forumJoinRequest.user,
      forum: forumJoinRequest.forum
    });

    await forumUser.save();

    return (await forumJoinRequest.populate('forum')).populate('user');
  },

  declineJoinRequest: async (_root: undefined, args: Record<string, string>): Promise<IForumJoinRequestDocument> => {
    // no user permission check here, in order to facilitate testing this action
    const forumJoinRequest: HydratedDocument<IForumJoinRequestDocument> = await ForumJoinRequestDocument.findById(args.forumJoinRequestId);

    forumJoinRequest.isAccepted = false;

    await forumJoinRequest.save();

    return (await forumJoinRequest.populate('forum')).populate('user');
  }
};

export const resolvers = { queries, mutations };
