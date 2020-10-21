import DataLoader from "dataloader";
import { Follow, followKey } from "./../models/follow/Follow.entity";
export const isFollowingLoader = () =>
  new DataLoader<followKey, boolean>(async (keys) => {
    const follows = await Follow.findByIds(keys as followKey[]);
    return keys.map(
      ({ followerId, followingId }) =>
        !!follows.filter(
          (follow) =>
            follow.followerId === followerId &&
            follow.followingId === followingId
        ).length
    );
  });
