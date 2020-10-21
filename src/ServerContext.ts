import dhive from "@hiveio/dhive";
import { Request, Response } from "express";
import { Redis } from "ioredis";
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

export interface ServerContext {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
  hive: dhive.Client;
  userByIdLoader: ReturnType<typeof userByIdLoader>;
  memeDownVotedLoader: ReturnType<typeof memeDownVotedLoader>;
  memeUpVotedLoader: ReturnType<typeof memeUpVotedLoader>;
  commentDownVotedLoader: ReturnType<typeof commentDownVotedLoader>;
  commentUpVotedLoader: ReturnType<typeof commentUpVotedLoader>;
  usersByClanIdLoader: ReturnType<typeof usersByClanIdLoader>;
  redditorByUsernameLoader: ReturnType<typeof redditorByUsernameLoader>;
  isFollowingLoader: ReturnType<typeof isFollowingLoader>;
}
