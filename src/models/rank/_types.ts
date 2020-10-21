import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Rank } from "./Rank.entity";

@ObjectType()
export class PaginatedRanks extends PaginatedResponse(Rank) {}
