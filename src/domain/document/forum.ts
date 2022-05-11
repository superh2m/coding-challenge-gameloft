import mongoose, { Schema } from 'mongoose';
import { IForumUser } from './forumUser';

export interface IForum {
    id: string;
    name: string;
    isPrivate: boolean;
    forumUsers: IForumUser[];
}

const schema: mongoose.Schema = new mongoose.Schema<IForum>({
    name: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    },
    forumUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'ForumUser'
    }]
});

export const Forum = mongoose.model<IForum>('Forum', schema);
