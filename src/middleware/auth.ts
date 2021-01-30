import { MiddlewareFn } from "type-graphql";
import { ServerContext } from "../ServerContext";

export const Auth: MiddlewareFn<ServerContext> = (
  {
    context: {
      req: { session },
    },
  },
  next
): Promise<CallableFunction> => {
  if (!session.userId) {
    throw new Error("not authenticated");
  }
  return next();
};
