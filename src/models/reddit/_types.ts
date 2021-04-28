import { ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { RedditMeme } from "./entities/RedditMeme";

@ObjectType()
export class PaginatedRedditMemes extends PaginatedResponse(RedditMeme) {}
