import { ClassType, Field, ObjectType } from "type-graphql";

// form input errors gql return object type
@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

// Abstract class to create paginated object type some other object type
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
