import { Schema, Model, model, Document } from 'mongoose';
import { IUser } from './user';
import { IPublication } from './publication';

const schemaVote = new Schema({
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: [true, 'La publicación es necesaria'],

    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es necesario']
    }
});

interface IVote extends Document {
    publication: IPublication;
    user: IUser;
}

const Vote: Model<IVote> = model<IVote>('Vote', schemaVote);

export {
    Vote
}