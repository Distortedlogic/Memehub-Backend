import DataLoader from "dataloader";
import { getConnection, In } from "typeorm";
import { User } from "../models/user/User.entity";
import { Redditors } from "./../generated/memedata/entities/Redditors";

export const userByIdLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    return userIds.map((id) => users.filter((user) => user.id === id)[0]);
  });

export const redditorByUsernameLoader = () =>
  new DataLoader<string, Redditors>(async (usernames) => {
    const redditors = await getConnection("memedata")
      .getRepository(Redditors)
      .createQueryBuilder("redditor")
      .select("redditor")
      .where("redditor.username IN (:...redditors)", { redditors: usernames })
      .getMany();
    return usernames.map(
      (username) =>
        redditors.filter((redditor) => redditor.username === username)[0]
    );
  });

export const usersByClanIdLoader = () =>
  new DataLoader<number, User[]>(async (clanIds) => {
    const users = await User.find({
      where: { clanId: In(clanIds as number[]) },
    });
    return clanIds.map((clanId) =>
      users.filter((user) => user.clanId === clanId)
    );
  });
