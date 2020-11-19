import { Field, ObjectType } from "type-graphql";

export type timeframe = "daily" | "weekly" | "monthly" | "ever";

@ObjectType()
export class Leader {
  @Field()
  userId: string;
  @Field()
  username: string;
  @Field()
  avatar: string;
  @Field()
  ups: string;
  @Field()
  downs: string;
}

@ObjectType()
export class LeaderBoard {
  @Field(() => [Leader])
  data: Leader[];
}
