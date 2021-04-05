import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import { RedisPubSub } from "graphql-redis-subscriptions";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { useContainer } from "typeorm";
import { createHiveConnection } from "./connections/hiveConnection";
import { createRedisConnection } from "./connections/redisConn";
import { createTypeormConnection } from "./connections/typeormConn";
import {
  commentDownVotedLoader,
  commentUpVotedLoader,
  memeDownVotedLoader,
  memeUpVotedLoader,
} from "./helpers/hasVotedLoaders";
import { memeByIdLoader } from "./helpers/memeLoaders";
import { redditorByIdLoader, userByIdLoader } from "./helpers/userLoaders";
import { StartCron } from "./tasks/cron";
import { emojiSync } from "./tasks/emojiSync";
import { hiveSync } from "./tasks/hiveSync";
import { templateSync } from "./tasks/templateSync";
import { COOKIE_NAME, __prod__ } from "./utils/constants";

const port = 5000;

// Used to enable custom repo injection into resolver
useContainer(Container);

const RedisStore = connectRedis(session);

(async () => {
  await createTypeormConnection();
  const redis = await createRedisConnection();
  const hive = await createHiveConnection();
  if (__prod__) {
    await emojiSync();
    await templateSync();
  }

  hiveSync(hive);
  StartCron();

  const pubSub = new RedisPubSub({
    publisher: await createRedisConnection(),
    subscriber: await createRedisConnection(),
  });

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/**/resolvers/*.{js,ts}"],
      validate: false,
      pubSub,
      container: Container,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      hive,
      userByIdLoader: userByIdLoader(),
      memeUpVotedLoader: memeUpVotedLoader(),
      memeDownVotedLoader: memeDownVotedLoader(),
      commentUpVotedLoader: commentUpVotedLoader(),
      commentDownVotedLoader: commentDownVotedLoader(),
      redditorByIdLoader: redditorByIdLoader(),
      memeByIdLoader: memeByIdLoader(),
    }),
    uploads: false,
    subscriptions: { onConnect: () => console.log("connected websocket") },
  });

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin:
        process.env.ENV === "production"
          ? process.env.CORS_ORIGIN
          : process.env.DEV_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
        domain: __prod__ ? ".memehub.lol" : undefined,
      },
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        disableTTL: true,
      }),
      name: COOKIE_NAME,
      secret: process.env.SECRET!,
      resave: false,
      saveUninitialized: false,
    })
  );

  // uncomment to track the execution time of resolvers
  // app.use("/graphql", (req, res, next) => {
  //   console.log("request", req);
  //   const startHrTime = process.hrtime();
  //   res.on("finish", () => {
  //     console.log("request", req);
  //     console.log("response", res);
  //     if (req.body && req.body.operationName) {
  //       const elapsedHrTime = process.hrtime(startHrTime);
  //       const elapsedTimeInMs =
  //         elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
  //       console.log({
  //         time: new Date(),
  //         name: req.body.operationName,
  //         msg: `Exec Time - ${elapsedTimeInMs}ms`,
  //       });
  //     }
  //   });
  //   next();
  // });

  apolloServer.applyMiddleware({ app, cors: false });
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`
    );
  });
})();
