import DataLoader from "dataloader";
import { Redditor } from "../models/reddit/entities/Redditor";
import { User } from "../models/user/entities/User";

export const userByIdLoader = () =>
  new DataLoader<string, User>(async (userIds) => {
    const users = await User.findByIds(userIds as string[]);
    return userIds.map((id) => users.filter((user) => user.id === id)[0]);
  });

export const redditorByIdLoader = () =>
  new DataLoader<number, Redditor>(async (userIds) => {
    const users = await Redditor.findByIds(userIds as number[]);
    return userIds.map((id) => users.filter((user) => user.id === id)[0]);
  });
