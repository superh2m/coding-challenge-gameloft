import mongoose, { Schema } from 'mongoose';
import { Forum, IForum } from './forum';
import { IUser, User } from './user';

export interface IForumJoinRequest {
    id: string;
    isAccepted: boolean;
    user: IUser;
    forum: IForum;
}

const schema = new mongoose.Schema<IForumJoinRequest>({
    isAccepted: {
        type: Boolean,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: false
    },
    forum: {
        type: Schema.Types.ObjectId,
        ref: Forum,
        required: false
    }
});

export const ForumJoinRequest = mongoose.model<IForumJoinRequest>('ForumJoinRequest', schema);
