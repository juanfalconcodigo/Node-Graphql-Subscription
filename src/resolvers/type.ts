import { IResolvers } from 'graphql-tools';
import { votesPublication } from '../lib/operation';

const type: IResolvers = {
    Publication: {
        votes: async (parent: any, _: any, __: any) => {
            return await votesPublication(parent._id);
        }
    }
}

export default type;