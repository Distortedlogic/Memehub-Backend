import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../../ServerContext";
import { User } from "../../user/entities/User";
import { Comment } from "../entities/Comment";
import { Meme } from "./../../meme/entities/Meme";

@Resolver(Comment)
export class CommentFieldResolver {
  @FieldResolver(() => Boolean)
  async hasUpvoted(
    @Root() comment: Comment,
    @Ctx() { req, commentUpVotedLoader }: ServerContext
  ) {
    return commentUpVotedLoader.load({
      commentId: comment.id,
      userId: req.session.userId,
    });
  }
  @FieldResolver(() => Boolean)
  async hasDownvoted(
    @Root() comment: Comment,
    @Ctx() { req, commentDownVotedLoader }: ServerContext
  ) {
    return commentDownVotedLoader.load({
      commentId: comment.id,
      userId: req.session.userId,
    });
  }
  @FieldResolver(() => User)
  async user(
    @Root() comment: Comment,
    @Ctx() { userByIdLoader }: ServerContext
  ) {
    return userByIdLoader.load(comment.userId);
  }
  @FieldResolver(() => Meme)
  async meme(
    @Root() comment: Comment,
    @Ctx() { memeByIdLoader }: ServerContext
  ) {
    return memeByIdLoader.load(comment.memeId);
  }
}
