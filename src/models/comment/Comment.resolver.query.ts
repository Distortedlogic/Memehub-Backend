import { Arg, Ctx, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { Auth } from "../../middleware/auth";
import { ServerContext } from "../../ServerContext";
import { ordermap } from "./../../utils/functions/orderMap";
import { Comment } from "./Comment.entity";
import { PaginatedComments } from "./_types";

@Resolver(Comment)
export class CommentResolver {
  @Query(() => PaginatedComments)
  async comments(
    @Arg("memeId") memeId: string,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) orderType: string
  ): Promise<PaginatedComments> {
    const realTake = Math.min(50, take);
    const order = ordermap(orderType);
    if (!order) return { hasMore: false, items: [] };
    const comments = await Comment.find({
      where: { memeId },
      order,
      take,
      skip,
    });
    return {
      items: comments,
      hasMore: comments.length === realTake ? true : false,
    };
  }

  @Query(() => PaginatedComments)
  @UseMiddleware(Auth)
  async myComments(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) orderType: string
  ): Promise<PaginatedComments> {
    const realTake = Math.min(50, take);
    const order = ordermap(orderType);
    if (!order) return { hasMore: false, items: [] };
    const comments = await Comment.find({
      where: { userId: session.userId },
      order,
      take: realTake,
      skip,
    });
    return {
      items: comments,
      hasMore: comments.length === realTake ? true : false,
    };
  }

  @Query(() => PaginatedComments)
  @UseMiddleware(Auth)
  async userComments(
    @Arg("userId") userId: string,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) orderType: string
  ): Promise<PaginatedComments> {
    const realTake = Math.min(50, take);
    const order = ordermap(orderType);
    if (!order) return { hasMore: false, items: [] };
    const comments = await Comment.find({
      where: { userId },
      order,
      take: realTake,
      skip,
    });
    return {
      items: comments,
      hasMore: comments.length === realTake ? true : false,
    };
  }
}
