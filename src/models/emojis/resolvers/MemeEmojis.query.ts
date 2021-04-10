import {
  Arg,
  Ctx,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Emoji } from "../entities/Emoji";
import { ServerContext } from "./../../../ServerContext";

@ObjectType()
class MemeEmoji {
  @Field(() => Int)
  count: number;
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  url: string;
  @Field()
  hasAdded: boolean;
}

@Resolver(MemeEmoji)
export class MemeEmojisQueryResolver {
  @Query(() => [MemeEmoji])
  async memeEmojis(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("memeId") memeId: string
  ): Promise<MemeEmoji[]> {
    const q = getConnection()
      .getRepository(Emoji)
      .createQueryBuilder("emoji")
      .leftJoin("emoji.userMemeEmojis", "userMemeEmoji")
      .leftJoin("userMemeEmoji.user", "user")
      .groupBy("emoji.id")
      .addGroupBy("userMemeEmoji.emojiId")
      .select("emoji.id", "id")
      .addSelect("emoji.name", "name")
      .addSelect("emoji.url", "url")
      .addSelect("COUNT(userMemeEmoji.userId)", "count")
      .addSelect(
        `CASE WHEN SUM(CASE WHEN user.id = '${session.userId}' THEN 1 ELSE 0 END)=1 THEN TRUE ELSE FALSE END`,
        "hasAdded"
      )
      .having("COUNT(userMemeEmoji.userId) > 0")
      .where("userMemeEmoji.memeId=:memeId", { memeId })
      .orderBy("COUNT(userMemeEmoji.userId)", "DESC")
      .limit(4);
    const emojis: MemeEmoji[] = await q.getRawMany();
    return emojis;
  }
}
