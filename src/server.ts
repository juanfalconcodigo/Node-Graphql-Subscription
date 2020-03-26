import express from 'express';
import { PORT } from './config/environment';
import compression from 'compression';
import { ApolloServer, AuthenticationError, PubSub } from 'apollo-server-express';
import cors from 'cors';
import http from 'http';
import schema from './schemas';
import Jwt from './lib/jwt';
import expressPlayGround from 'graphql-playground-middleware-express';

class Server {

    app: express.Application;
    private server: ApolloServer;
    private port: number;
    private httpServer: http.Server;
    private static _instance: Server;
    private pubsub: PubSub;

    private constructor() {
        this.app = express();
        this.pubsub = new PubSub();
        this.port = PORT;
        this.middlewares();
        //es la única solución que encontre para unir lo de user y el pubsub
        this.server = new ApolloServer({
            schema, introspection: true, context: async ({ req, connection }: any): Promise<{ user: any, pubsub: PubSub }> => {
                const token: string = req ? req.headers.token : connection.token;
                const jwtUser = await new Jwt().getUser(token);
                const { status, user } = jwtUser;
                //if(!status) throw new AuthenticationError('Usted necesita loguearse para tener acceso a estos recursos'); 
                return await { user, pubsub: this.pubsub }
            }
        });
        this.server.applyMiddleware({ app: this.app });
        //necesario inmediatamente despues de applyMiddleware
        this.configExpressPlayGround();
        this.httpServer = new http.Server(this.app);
        this.server.installSubscriptionHandlers(this.httpServer);
    }

    private setting() {

    }

    /*  private async context({ req, connection }: any): Promise<{ user: any, pubsub: PubSub }> {
         const token: string = req ? req.headers.token : connection.token;
         const jwtUser = await new Jwt().getUser(token);
         const { status, user } = jwtUser;
         //if(!status) throw new AuthenticationError('Usted necesita loguearse para tener acceso a estos recursos'); 
         return await { user, pubsub: new PubSub() }
     } */

    private configExpressPlayGround() {
        this.app.use('/', expressPlayGround({
            endpoint: '/graphql'
        }));
    }

    private middlewares() {
        this.app.use(compression());
        this.app.use(cors({ origin: true, credentials: true }));
    }

    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`Se esta corriendo exitosamente en el puerto : ${this.port}`);
            console.log(`http://localhost:${this.port}${this.server.graphqlPath}`);
            console.log(`ws://localhost:${this.port}${this.server.subscriptionsPath}`);
        });
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }


}

export default Server;