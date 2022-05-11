import mongoose from 'mongoose';

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    picture?: string;
}

const schema: mongoose.Schema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    }
});

export const User = mongoose.model<IUser>('User', schema);
