import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http, { Server as HttpServer } from 'http';
import { typeDefs, resolvers } from '../domain/graphql';
import mongooseClient from '../infra/mongodb/mongooseClient';
import express, { Application } from 'express';
import { Connection } from 'mongoose';
import config from './config';

export interface IApp {
    dbConnection: Connection;
    app: Application;
    httpServer: HttpServer;
    graphqlServer: ApolloServer;
}

export default async (): Promise<IApp> => {
    const dbConnection: Connection = await mongooseClient();
    const app: Application = express();

    const httpServer: HttpServer = http.createServer(app);

    const graphqlServer = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app });

    httpServer.listen({ port: config.api.port }, () => {
        console.info(`🚀 Server ready at http://localhost:${config.api.port}${graphqlServer.graphqlPath}`);
    });

    return {
        dbConnection,
        app,
        httpServer,
        graphqlServer
    };
}
