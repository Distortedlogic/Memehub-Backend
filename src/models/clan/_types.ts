import { Field, ObjectType } from "type-graphql";
import { Clan } from "./Clan.entity";

@ObjectType()
export class PaginatedClans {
  @Field(() => [Clan])
  items: Clan[];
  @Field(() => Boolean)
  hasMore: boolean;
}
