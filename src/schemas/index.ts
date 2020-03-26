import 'graphql-import-node';
import typeDefs from './schema.graphql';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'apollo-server-express';
import resolvers from '../resolvers/resolvers.map';

const schema:GraphQLSchema=makeExecutableSchema({
   typeDefs,
   resolvers
})

export default schema;