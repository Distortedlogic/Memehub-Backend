import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Investment } from "./entities/Investment";

@ObjectType()
export class PaginatedInvestments extends PaginatedResponse(Investment) {}
