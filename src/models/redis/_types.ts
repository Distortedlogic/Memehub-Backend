import { Field, ObjectType } from "type-graphql";

export type timeframe = "daily" | "weekly" | "monthly" | "ever";

@ObjectType()
export class Leader {
  @Field(() => String)
  userId: string;
  @Field(() => String)
  username: string;
  @Field(() => String)
  avatar: string;
  @Field(() => String)
  ups: string;
  @Field(() => String)
  downs: string;
}

@ObjectType()
export class LeaderBoard {
  @Field(() => [Leader])
  data: Leader[];
}
