import { HydratedDocument } from 'mongoose';
import { IUser as IUserDocument } from '../../../domain/document/user';
import { Authenticator } from '../../../app/dev/authenticator';
import { Forum as ForumDocument, IForum as IForumDocument } from '../../document/forum';
import { ForumUser as ForumUserDocument, IForumUser as IForumUserDocument, Role } from '../../document/forumUser';

const queries = {
  forums: async (_root: undefined, args: Record<string, string>): Promise<IForumDocument[]> => {
    const q = new RegExp(`${args.q ?? ''}`);

    return await ForumDocument.find({ name: q, isPrivate: false });
  },

  forum: async (_root: undefined, args: Record<string, string>): Promise<IForumDocument> => {    
    return await ForumDocument.findById(args.id);
  },

  myForums: async (): Promise<IForumDocument[]> => {
    const currentUser: IUserDocument = await Authenticator.getDefaultUser();
    
    return (
      await ForumDocument.find().populate({
        path: 'forumUsers',			
        populate: { path:  'user' }
      })
    ).filter(forum => {
      for(let i = 0; i < forum.forumUsers.length; i++) {
        if (forum.forumUsers[i].user.id === currentUser.id) {
          return true;
        }
      }

      return false;
    });
  }
};

const mutations = {
  createForum: async (_root: undefined, args: Record<string, string|boolean>): Promise<IForumDocument> => {
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

    forum.forumUsers.push(forumUser);

    await forum.save();
    
    return forum;
  }
};

export const resolvers = { queries, mutations };
