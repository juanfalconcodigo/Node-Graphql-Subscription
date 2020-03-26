import { Schema, model, Model, Document } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    age: {
        type: Number,
        required: [true, 'La edad es necesaria']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    password: {
        type: String,
        required: [true, 'El nombre es necesario'],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        minlength: 6
    },
    role: {
        type: String,
        required: [true, 'El rol es necesario']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

interface IUser extends Document {
    name: string;
    age: number;
    lastName: string;
    password: string;
    email: string
    role: string;
    createAt: Date;
};

const User: Model<IUser> = model<IUser>('User', userSchema);
export {
    User,
    IUser
}







