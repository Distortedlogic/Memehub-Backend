import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Auth } from "./../../../middleware/auth";
import { ServerContext } from "./../../../ServerContext";
import { Meme } from "./../../meme/entities/Meme";
import { User } from "./../../user/entities/User";
import { Emoji } from "./../entities/Emoji";
import { UserMemeEmoji } from "./../entities/UserMemeEmoji";
@Resolver(UserMemeEmoji)
export class MemeResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async addEmoji(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("memeId") memeId: string,
    @Arg("emojiId") emojiId: string
  ): Promise<boolean> {
    const userMemeEmoji = await UserMemeEmoji.findOne({
      where: { userId: session.userId, memeId, emojiId },
    });
    if (userMemeEmoji) {
      await UserMemeEmoji.remove(userMemeEmoji);
    } else {
      await UserMemeEmoji.create({
        userId: session.userId,
        user: await User.findOne(session.userId),
        memeId,
        meme: await Meme.findOne(memeId),
        emojiId,
        emoji: await Emoji.findOne(emojiId),
      }).save();
    }
    return true;
  }
}
