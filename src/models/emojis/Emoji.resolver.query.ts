import { Query, Resolver } from "type-graphql";
import { Emoji } from "./Emoji.entity";

@Resolver(Emoji)
export class EmojiQueryResolver {
  @Query(() => [Emoji])
  async emojis(): Promise<Emoji[]> {
    return Emoji.find();
  }
}
