import { Schema, Model, model, Document, Types } from 'mongoose';
import { IUser } from './user';
const publicationSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripción es necesaria']
    },
    img: {
        type: String,
        required: [true, 'La url de la imagen es necesaria']
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Es necesario el id de usuario']
    }
});

interface IPublication extends Document {
    description: string;
    img: string;
    createAt: Date;
    user: IUser;
}

const Publication: Model<IPublication> = model<IPublication>('Publication', publicationSchema);
export {
    Publication,
    IPublication
}