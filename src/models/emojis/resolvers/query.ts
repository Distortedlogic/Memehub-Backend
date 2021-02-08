import { Query, Resolver } from "type-graphql";
import { Emoji } from "../entities/Emoji";

@Resolver(Emoji)
export class EmojiQueryResolver {
  @Query(() => [Emoji])
  async emojis(): Promise<Emoji[]> {
    return Emoji.find();
  }
}
