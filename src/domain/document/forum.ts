import mongoose from 'mongoose';

export interface IForum {
    id: string;
    name: string;
    isPrivate: boolean;
}

const schema = new mongoose.Schema<IForum>({
    name: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    }
});

export const Forum = mongoose.model<IForum>('Forum', schema);
