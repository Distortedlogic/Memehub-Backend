import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../ServerContext";
import { RedditMeme } from "./RedditMeme.entity";
import { Redditor } from "./Redditor.entity";

@Resolver(RedditMeme)
export class RedditFieldResolver {
  @FieldResolver(() => Redditor)
  async redditor(
    @Root() redditMeme: RedditMeme,
    @Ctx() { redditorByIdLoader }: ServerContext
  ) {
    return redditorByIdLoader.load(redditMeme.redditorId);
  }
}
