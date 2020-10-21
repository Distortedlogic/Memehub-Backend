import { ClassType, Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

export type keyNameType = "owner" | "active" | "posting" | "memo";

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items: TItem[];
    @Field()
    hasMore: boolean;
  }
  return PaginatedResponseClass;
}
