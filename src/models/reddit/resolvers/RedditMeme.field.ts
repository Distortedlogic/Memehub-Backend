import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../../ServerContext";
import { RedditMeme } from "../entities/RedditMeme";
import { Redditor } from "../entities/Redditor";
import { Investment } from "./../../investment/entities/Investment";

@Resolver(RedditMeme)
export class RedditFieldResolver {
  @FieldResolver(() => Redditor)
  async redditor(
    @Root() redditMeme: RedditMeme,
    @Ctx() { redditorByIdLoader }: ServerContext
  ) {
    return redditorByIdLoader.load(redditMeme.redditorId);
  }

  @FieldResolver(() => Investment, { nullable: true })
  async investment(
    @Root() redditMeme: RedditMeme,
    @Ctx() { req: { session } }: ServerContext
  ): Promise<Investment | undefined> {
    return Investment.findOne({
      where: { userId: session.userId, redditId: redditMeme.redditId },
    });
  }
}
