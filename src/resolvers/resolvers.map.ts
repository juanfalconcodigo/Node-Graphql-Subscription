import { IResolvers } from 'graphql-tools';
import mutation from "./mutation";
import query from "./query";
import type from './type';
import subscription from './subscription';

const resolvers: IResolvers = {
    ...query,
    ...mutation,
    ...subscription,
    ...type
}

export default resolvers;