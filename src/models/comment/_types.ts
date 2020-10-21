import { Field, ObjectType } from "type-graphql";
import { Comment } from "./Comment.entity";

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment])
  items: Comment[];
  @Field(() => Boolean)
  hasMore: boolean;
}

export enum Topic {
  NewComment = "NEW_COMMENT",
}
