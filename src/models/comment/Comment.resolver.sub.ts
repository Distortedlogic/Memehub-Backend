import { Arg, Resolver, Root, Subscription } from "type-graphql";
import { Comment } from "./Comment.entity";
import { Topic } from "./_types";

@Resolver(Comment)
export class CommentSubscriptionResolver {
  @Subscription(() => Comment, {
    topics: Topic.NewComment,
    filter: ({ payload, args }) => {
      return payload.userId === args.userId;
    },
  })
  newComments(
    @Root() newComment: Comment,
    @Arg("userId") userId: string
  ): Comment {
    newComment.createdAt = new Date(newComment.createdAt);
    console.log("fired", "comment", newComment, "userId", userId);
    return newComment;
  }
}
