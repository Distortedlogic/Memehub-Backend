import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../ServerContext";
import { RedditMemes } from "./../../generated/memedata/entities/RedditMemes";
import { Redditors } from "./../../generated/memedata/entities/Redditors";

@Resolver(RedditMemes)
export class RedditFieldResolver {
  @FieldResolver(() => Redditors)
  async redditor(
    @Root() redditMeme: RedditMemes,
    @Ctx() { redditorByUsernameLoader }: ServerContext
  ) {
    return redditorByUsernameLoader.load(redditMeme.username);
  }
}
