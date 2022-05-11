import { HydratedDocument } from 'mongoose';
import { Authenticator } from '../../../app/dev/authenticator';
import { Forum as ForumDocument, IForum as IForumDocument } from '../../document/forum';
import { ForumUser as ForumUserDocument, IForumUser as IForumUserDocument, Role } from '../../document/forumUser';

const queries = {
  forums: async (root: undefined, args: Record<string, string>): Promise<IForumDocument[]> => {
    const q = new RegExp(`${args.q ?? ''}`);

    return await ForumDocument.find({ name: q, isPrivate: false });
  },

  forum: async (root: undefined, args: Record<string, string>): Promise<IForumDocument> => {    
    return await ForumDocument.findById(args.id);
  }
};

const mutations = {
  createForum: async (root: undefined, args: Record<string, string|boolean>): Promise<IForumDocument> => {
    const forum: HydratedDocument<IForumDocument> = new ForumDocument({
      name: args.name,
      isPrivate: args.isPrivate
    });

    await forum.save();

    const forumUser: HydratedDocument<IForumUserDocument> = new ForumUserDocument({
      role: Role.ADMIN,
      user: await Authenticator.getDefaultUser(),
      forum
    });

    await forumUser.save();
    
    return forum;
  }
};

export const resolvers = { queries, mutations };
