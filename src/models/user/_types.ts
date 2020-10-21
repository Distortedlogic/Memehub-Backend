import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./../../utils/types";
import { User } from "./User.entity";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}
