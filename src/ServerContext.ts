import dhive from "@hiveio/dhive";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import {
  commentDownVotedLoader,
  commentUpVotedLoader,
  memeDownVotedLoader,
  memeUpVotedLoader,
} from "./helpers/hasVotedLoaders";
import { memeByIdLoader } from "./helpers/memeLoaders";
import { redditorByIdLoader, userByIdLoader } from "./helpers/userLoaders";

// Interface that describes the Server context
// These are made available to each resolver on the gql endpoint
export interface ServerContext {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
  hive: dhive.Client;
  memehubId: string;
  getSeason: () => Promise<number>;
  userByIdLoader: ReturnType<typeof userByIdLoader>;
  memeDownVotedLoader: ReturnType<typeof memeDownVotedLoader>;
  memeUpVotedLoader: ReturnType<typeof memeUpVotedLoader>;
  commentDownVotedLoader: ReturnType<typeof commentDownVotedLoader>;
  commentUpVotedLoader: ReturnType<typeof commentUpVotedLoader>;
  redditorByIdLoader: ReturnType<typeof redditorByIdLoader>;
  memeByIdLoader: ReturnType<typeof memeByIdLoader>;
}
