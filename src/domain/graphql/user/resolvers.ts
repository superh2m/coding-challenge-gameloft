import { HydratedDocument } from 'mongoose';
import { Authenticator } from '../../../app/dev/authenticator';
import { IUser as IUserDocument, User as UserDocument } from '../../document/user';

const queries = {
  user: async (_root: undefined, args: Record<string, string>): Promise<IUserDocument> => {
    return await UserDocument.findById(args.id).exec();
  }
};

const mutations = {
  updateProfile: async (_root: undefined, args: Record<string, string>): Promise<IUserDocument> => {
    const currentUser: HydratedDocument<IUserDocument> = await Authenticator.getDefaultUser();

    currentUser.firstName = args.firstName;
    currentUser.lastName = args.lastName;
    currentUser.picture = args.picture ?? null;

    await currentUser.save();

    return currentUser;
  }
};

export const resolvers = { queries, mutations };
