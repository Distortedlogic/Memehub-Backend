import dayjs from "dayjs";
import { createTypeormConnection } from "./../connections/typeormConn";
import { Rank } from "./../models/rank/Rank.entity";
import { User } from "./../models/user/User.entity";
import { createNewUsers } from "./utils/createNewUsers";
import { doCommenting } from "./utils/doCommenting";
import { doCommentVoting } from "./utils/doCommentVoting";
import { doFollowing } from "./utils/doFollowing";
import { doMemeVoting } from "./utils/doMemeVoting";
import { doPosting } from "./utils/doPosting";
import { getCurrent } from "./utils/getCurrent";
import { getCurrentUsers } from "./utils/getCurrentUsers";
import { getRedditMemes } from "./utils/getRedditMemes";
import { logStats } from "./utils/logStats";
import { recordRank } from "./utils/recordRank";

(async () => {
  const startTime = dayjs();
  const errors = {
    createUsers: 0,
    follow: 0,
    memePosting: 0,
    commentPosting: 0,
    memeVoting: 0,
    commentVoting: 0,
    recordRank: 0,
  };
  const conn = await createTypeormConnection();
  const redditMemes = await getRedditMemes(conn);
  let current = getCurrent();
  await User.remove(await User.find());
  conn.createQueryBuilder().delete().from(Rank).execute();
  await createNewUsers(conn, current);
  while (current < dayjs()) {
    const now = dayjs();
    const currentUsers = await getCurrentUsers(conn);
    try {
      await createNewUsers(conn, current);
    } catch (error) {
      errors.createUsers++;
    }
    for (const userId of currentUsers) {
      const memes = [redditMemes.pop()!];
      try {
        await doPosting(conn, memes, userId, current);
      } catch (error) {
        errors.memePosting++;
      }
      try {
        await doFollowing(conn, userId, current);
      } catch (error) {
        errors.follow++;
      }
      try {
        await doCommenting(conn, userId, current);
      } catch (error) {
        errors.commentPosting++;
      }
      try {
        await doMemeVoting(conn, userId, current);
      } catch (error) {
        errors.memeVoting++;
      }
      try {
        await doCommentVoting(conn, userId, current);
      } catch (error) {
        errors.commentVoting++;
      }
    }
    current = current.add(1, "h");
    errors.recordRank = await recordRank(conn, current);
    await logStats(current, now, errors);
  }
  console.log(`Total Exec Time: ${dayjs().diff(startTime, "s")}`);
})();
