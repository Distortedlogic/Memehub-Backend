import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Meme } from "./Entity/Meme.entity";

@ObjectType()
export class PaginatedMemes extends PaginatedResponse(Meme) {}

export const communityList = [
  "original",
  "hive",
  "dark",
  "wholesome",
  "political",
];
