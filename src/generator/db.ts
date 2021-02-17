import dayjs from "dayjs";
import faker from "faker";
import { User } from "src/models/user/entities/User";
import { Rank } from "../models/rank/entities/Rank";
import { createTypeormConnection } from "./../connections/typeormConn";
import { createNewUsers } from "./utils/createNewUsers";
import { doCommenting } from "./utils/doCommenting";
import { doCommentVoting } from "./utils/doCommentVoting";
import { doFollowing } from "./utils/doFollowing";
import { doMemeVoting } from "./utils/doMemeVoting";
import { doPosting } from "./utils/doPosting";
import { getCurrent } from "./utils/getCurrent";
import { getCurrentUsers } from "./utils/getCurrentUsers";
import { logStats } from "./utils/logStats";
import { recordRank } from "./utils/recordRank";

// simulates website activity via populating the database with fake data
// fast, efficient, decently realistic for visualizations in development

(async () => {
  const startTime = dayjs();
  const conn = await createTypeormConnection();
  // Used when python docker image is up and scrapping memes
  // from reddit into the database, else use faker
  // const redditMemes = await getRedditMemes(conn);
  let current = getCurrent();
  await User.remove(await User.find());
  conn.createQueryBuilder().delete().from(Rank).execute();
  await createNewUsers(conn, current);
  while (current < dayjs()) {
    const now = dayjs();
    const currentUsers = await getCurrentUsers(conn);
    await createNewUsers(conn, current);
    for (const userId of currentUsers) {
      // gets meme image urls from scrapped reddit memes query in comments above
      // const memes = [redditMemes.pop()!];
      // else use faker
      const memes = [faker.image.imageUrl()];
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
