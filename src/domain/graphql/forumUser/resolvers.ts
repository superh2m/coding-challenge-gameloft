import { ForumUser as ForumUserDocument, IForumUser as IForumUserDocument } from '../../document/forumUser';

const queries = {
  forumUsers: async (root: undefined, args: Record<string, string>): Promise<IForumUserDocument[]> => {
    return await ForumUserDocument.find({ forum: args.forumId }).populate('user').populate('forum');
  },
};
  
const mutations = {
};

export const resolvers = { queries, mutations };
