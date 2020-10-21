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
import { isFollowingLoader } from "./helpers/followLoader";
import {
  commentDownVotedLoader,
  commentUpVotedLoader,
  memeDownVotedLoader,
  memeUpVotedLoader,
} from "./helpers/hasVotedLoaders";
import {
  redditorByUsernameLoader,
  userByIdLoader,
  usersByClanIdLoader,
} from "./helpers/userLoaders";
import { StartCron } from "./tasks/cron";
import { COOKIE_NAME, __prod__ } from "./utils/constants";

useContainer(Container);
const RedisStore = connectRedis(session);
StartCron();

(async () => {
  await createTypeormConnection();
  const redis = await createRedisConnection();
  const hive = await createHiveConnection();

  const pubSub = new RedisPubSub({
    publisher: await createRedisConnection(),
    subscriber: await createRedisConnection(),
  });

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/**/*.resolver*.{js,ts}"],
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
      usersByClanIdLoader: usersByClanIdLoader(),
      redditorByUsernameLoader: redditorByUsernameLoader(),
      isFollowingLoader: isFollowingLoader(),
    }),
    uploads: false,
    subscriptions: { onConnect: () => console.log("connected websocket") },
  });

  app.set("trust proxy", 1);
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
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

  // app.use("/graphql", (req, res, next) => {
  //   const startHrTime = process.hrtime();
  //   res.on("finish", () => {
  //     if (req.body && req.body.operationName) {
  //       const elapsedHrTime = process.hrtime(startHrTime);
  //       const elapsedTimeInMs =
  //         elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
  //       logger.info({
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

  httpServer.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`
    );
  });
})();
