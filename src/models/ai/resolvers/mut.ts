import axios from "axios";
import { Arg, Mutation } from "type-graphql";
export class AIResolver {
  @Mutation(() => String)
  async memeClf(@Arg("url") url: string): Promise<String> {
    try {
      const resp = await axios.post("http://controllers:8000/meme_clf", {
        url,
      });
      return resp.data.pred;
    } catch (error) {
      return "Error";
    }
  }
}
