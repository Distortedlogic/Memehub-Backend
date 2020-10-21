import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Auth } from "../../middleware/auth";
import { ServerContext } from "../../ServerContext";
import { Comment } from "./Comment.entity";
import { CommentVote } from "./CommentVote.entity";
import { Topic } from "./_types";

@Resolver(Comment)
export class CommentResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async postComment(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("text", () => String) text: string,
    @Arg("memeId", () => Int) memeId: number,
    @PubSub(Topic.NewComment) NewComment: Publisher<Comment>
  ) {
    const { userId } = session;
    if (!text) return false;
    const comment = await Comment.create({ text, userId, memeId }).save();
    await NewComment(comment);
    return true;
  }

  @Mutation(() => Comment)
  @UseMiddleware(Auth)
  async upVoteComment(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("commentId", () => Int) commentId: number
  ): Promise<Comment | undefined> {
    const { userId } = session;
    if (await CommentVote.findOne({ where: { userId, commentId } })) return;
    try {
      await CommentVote.create({ upvote: true, userId, commentId }).save();
    } catch (error) {
      throw error;
    }
    return await Comment.findOne(commentId);
  }
  @Mutation(() => Comment)
  @UseMiddleware(Auth)
  async downVoteComment(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("commentId", () => Int) commentId: number
  ): Promise<Comment | undefined> {
    const { userId } = session;
    if (await CommentVote.findOne({ where: { userId, commentId } })) return;
    await CommentVote.create({ upvote: false, userId, commentId }).save();
    return await Comment.findOne(commentId);
  }
}
