import { HydratedDocument } from 'mongoose';
import { Authenticator } from '../../../app/dev/authenticator';
import { ForumMessage as ForumMessageDocument, IForumMessage as IForumMessageDocument } from '../../document/forumMessage';
import { ForumUser as ForumUserDocument, IForumUser as IForumUserDocument } from '../../document/forumUser';
import { ForbiddenError } from 'apollo-server-express';

const queries = {
  forumMessages: async (_root: undefined, args: Record<string, string>): Promise<IForumMessageDocument[]> => {
    return await ForumMessageDocument.find({ forum: args.forumId }).populate('forum').populate({
      path: 'forumUser',
      populate: { path:  'user' }
    }).sort([['sendedAt', 'asc']]);
  }
};

const mutations = {
  postMessage: async (_root: undefined, args: Record<string, string>): Promise<IForumMessageDocument> => {
    const forumUser: IForumUserDocument = await ForumUserDocument.findOne({ forum: args.forumId, user: await Authenticator.getDefaultUser() });

    if (forumUser === null) {
      throw new ForbiddenError('User not allowed to post on this forum');
    }

    const forumMessage: HydratedDocument<IForumMessageDocument> = new ForumMessageDocument({
      content: args.content,
      forum: args.forumId,
      forumUser,
      sendedAt: new Date()
    });

    await forumMessage.save();

    return await (await forumMessage.populate('forum')).populate({
      path: 'forumUser',
      populate: [{ path: 'user' }, { path: 'forum' }]
    });
  }
};

export const resolvers = { queries, mutations };
