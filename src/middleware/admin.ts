import { MiddlewareFn } from "type-graphql";
import { ServerContext } from "../ServerContext";

export const Admin: MiddlewareFn<ServerContext> = async (
  {
    context: {
      req: { session },
      memehubId,
    },
  },
  next
): Promise<CallableFunction> => {
  if (session.userId === memehubId) {
    return next();
  } else {
    throw new Error("not admin");
  }
};
