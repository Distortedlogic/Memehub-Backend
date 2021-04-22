import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { RedditMeme } from "./entities/RedditMeme";
import { RedditNew } from "./entities/RedditNew";

@ObjectType()
export class PaginatedRedditMemes extends PaginatedResponse(RedditMeme) {}

@ObjectType()
export class PaginatedRedditNew extends PaginatedResponse(RedditNew) {}
