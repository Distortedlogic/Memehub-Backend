import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../ServerContext";
import { User } from "../user/User.entity";
import { Comment } from "./Comment.entity";

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
}
