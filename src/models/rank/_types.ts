import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Rank } from "./entities/Rank";

@ObjectType()
export class PaginatedRanks extends PaginatedResponse(Rank) {}
