import mongoose, { Schema } from 'mongoose';
import { IForum } from './forum';
import { IUser } from './user';

export enum Role {
    PARTICIPANT = 'PARTICIPANT',
    ADMIN = 'ADMIN'
}

export interface IForumUser {
    role: string;
    user: IUser;
    forum: IForum;
}

const schema: mongoose.Schema = new mongoose.Schema<IForumUser>({
    role: {
        type: String,
        enum: Role,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    forum: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true
    }
});

export const ForumUser = mongoose.model<IForumUser>('ForumUser', schema);
