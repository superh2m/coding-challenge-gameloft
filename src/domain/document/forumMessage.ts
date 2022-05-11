import mongoose, { Schema } from 'mongoose';
import { IForum } from './forum';
import { IForumUser } from './forumUser';

export interface IForumMessage {
    content: string;
    forum: IForum;
    forumUser: IForumUser;
    sendedAt: Date;
}

const schema: mongoose.Schema = new mongoose.Schema<IForumMessage>({
    content: {
        type: String,
        required: true
    },
    forum: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true
    },
    forumUser: {
        type: Schema.Types.ObjectId,
        ref: 'ForumUser',
        required: true
    },
    sendedAt: {
        type: Date,
        required: true
    }
});

export const ForumMessage = mongoose.model<IForumMessage>('ForumMessage', schema);
