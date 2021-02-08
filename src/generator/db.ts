import dayjs from "dayjs";
import { Rank } from "../models/rank/entities/Rank";
import { createTypeormConnection } from "./../connections/typeormConn";
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
  const conn = await createTypeormConnection();
  const redditMemes = await getRedditMemes(conn);
  let current = getCurrent();
  await User.remove(await User.find());
  conn.createQueryBuilder().delete().from(Rank).execute();
  await createNewUsers(conn, current);
  while (current < dayjs()) {
    const now = dayjs();
    const currentUsers = await getCurrentUsers(conn);
    await createNewUsers(conn, current);
    for (const userId of currentUsers) {
      const memes = [redditMemes.pop()!];
      await doPosting(conn, memes, userId, current);
      await doFollowing(conn, userId, current);
      await doCommenting(conn, userId, current);
      await doMemeVoting(conn, userId, current);
      await doCommentVoting(conn, userId, current);
    }
    current = current.add(1, "h");
    await recordRank(conn, current);
    await logStats(current, now);
  }
  console.log(`Total Exec Time: ${dayjs().diff(startTime, "s")}`);
})();
