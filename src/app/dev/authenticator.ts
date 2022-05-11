import { HydratedDocument } from 'mongoose';
import { IUser, User } from '../../domain/document/user';

export class Authenticator {
  public static readonly DEFAULT_USER_EMAIL = 'mohamedmahmoud.hama@gmail.com';

  private static defaultUser: HydratedDocument<IUser>;

  public static async getDefaultUser(): Promise<HydratedDocument<IUser>> {
    if (!Authenticator.defaultUser) {
      Authenticator.defaultUser = await User.findOne({ email: Authenticator.DEFAULT_USER_EMAIL});
    }

    return Authenticator.defaultUser;
  }
}
