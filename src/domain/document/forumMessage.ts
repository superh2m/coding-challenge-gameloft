import mongoose, { Schema } from 'mongoose';
import { Forum, IForum } from './forum';
import { ForumUser, IForumUser } from './forumUser';

export interface IForumMessage {
    content: string;
    forum: IForum;
    forumUser: IForumUser;
    sendedAt: Date;
}

const schema = new mongoose.Schema<IForumMessage>({
    content: {
        type: String,
        required: true
    },
    forum: {
        type: Schema.Types.ObjectId,
        ref: Forum,
        required: true
    },
    forumUser: {
        type: Schema.Types.ObjectId,
        ref: ForumUser,
        required: true
    },
    sendedAt: {
        type: Date,
        required: true
    }
});

export const ForumMessage = mongoose.model<IForumMessage>('ForumMessage', schema);
