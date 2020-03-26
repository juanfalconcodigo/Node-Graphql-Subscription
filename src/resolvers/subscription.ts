import { IResolvers } from 'graphql-tools';
import { CHANGE_VOTES } from '../config/environment';
import { PubSub } from 'apollo-server-express';

const subscription: IResolvers = {
    Subscription: {
        changeVotes: {
            subscribe: async (_: void, __: any, { pubsub }) => {
                return pubsub.asyncIterator(CHANGE_VOTES);
            }
        }
    }
}

export default subscription;