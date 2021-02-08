import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Auth } from "../../../middleware/auth";
import { ServerContext } from "../../../ServerContext";
import { Comment } from "../entities/Comment";
import { CommentVote } from "../entities/CommentVote";
import { Topic } from "../_types";

@Resolver(Comment)
export class CommentResolver {
  @Mutation(() => Comment)
  @UseMiddleware(Auth)
  async postComment(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("text") text: string,
    @Arg("memeId") memeId: string,
    @PubSub(Topic.NewComment) NewComment: Publisher<Comment>
  ) {
    const { userId } = session;
    const comment = await Comment.create({
      text,
      userId,
      memeId,
    }).save();
    await NewComment(comment);
    return comment;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async setCommentIsHive(
    @Arg("commentId") commentId: string,
    @Arg("permlink") permlink: string
  ): Promise<boolean> {
    try {
      await getConnection()
        .createQueryBuilder()
        .update(Comment)
        .set({ isHive: true, permlink })
        .where("id = :id", { id: commentId })
        .execute();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Comment)
  @UseMiddleware(Auth)
  async upVoteComment(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("commentId") commentId: string
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
    @Arg("commentId") commentId: string
  ): Promise<Comment | undefined> {
    const { userId } = session;
    if (await CommentVote.findOne({ where: { userId, commentId } })) return;
    await CommentVote.create({ upvote: false, userId, commentId }).save();
    return await Comment.findOne(commentId);
  }
}
