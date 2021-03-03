import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../../ServerContext";
import { User } from "../../user/entities/User";
import { Meme } from "../entities/Meme";

@Resolver(Meme)
export class MemeFieldResolver {
  @FieldResolver(() => Boolean)
  async hasUpvoted(
    @Root() meme: Meme,
    @Ctx() { req, memeUpVotedLoader }: ServerContext
  ) {
    return memeUpVotedLoader.load({
      memeId: meme.id,
      userId: req.session.userId,
    });
  }
  @FieldResolver(() => Boolean)
  async hasDownvoted(
    @Root() meme: Meme,
    @Ctx() { req, memeDownVotedLoader }: ServerContext
  ) {
    return memeDownVotedLoader.load({
      memeId: meme.id,
      userId: req.session.userId,
    });
  }
  @FieldResolver(() => User)
  async user(@Root() meme: Meme, @Ctx() { userByIdLoader }: ServerContext) {
    return userByIdLoader.load(meme.userId);
  }
}
