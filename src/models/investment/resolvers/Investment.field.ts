import { FieldResolver, Resolver, Root } from "type-graphql";
import { RedditMeme } from "./../../reddit/entities/RedditMeme";
import { Investment } from "./../entities/Investment";
@Resolver(Investment)
export class InvestmentFieldResolver {
  @FieldResolver(() => RedditMeme)
  async meme(@Root() investment: Investment): Promise<RedditMeme> {
    const meme = await RedditMeme.findOne({
      where: { redditId: investment.redditId },
    });
    if (meme) return meme;
    else {
      throw new Error("meme not found");
    }
  }
}
