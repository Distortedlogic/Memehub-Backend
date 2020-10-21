import { MiddlewareFn } from "type-graphql";
import { ServerContext } from "../ServerContext";

export const Auth: MiddlewareFn<ServerContext> = (
  {
    context: {
      req: {
        session: { userId },
      },
    },
  },
  next
): Promise<CallableFunction> => {
  if (!userId) {
    throw new Error("not authenticated");
  }
  return next();
};
