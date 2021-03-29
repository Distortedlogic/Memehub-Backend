// simulates website activity via populating the database with fake data
// fast, efficient, decently realistic for visualizations in development
import AWS from "aws-sdk";
import dayjs from "dayjs";
import "dotenv-safe/config";
import { Rank } from "../models/rank/entities/Rank";
import { createTypeormConnection } from "./../connections/typeormConn";
import { User } from "./../models/user/entities/User";
import { BUCKET_BASE_URL } from "./../utils/constants";
import { createNewUsers } from "./utils/createNewUsers";
import { doCommenting } from "./utils/doCommenting";
import { doCommentVoting } from "./utils/doCommentVoting";
import { doMemeVoting } from "./utils/doMemeVoting";
import { doPosting } from "./utils/doPosting";
import { getCurrent } from "./utils/getCurrent";
import { getCurrentUsers } from "./utils/getCurrentUsers";
import { getRedditMemes } from "./utils/getRedditMemes";
import { logStats } from "./utils/logStats";
import { recordRank } from "./utils/recordRank";

AWS.config.update({
  apiVersion: "2010-12-01",
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
  region: "us-east-1",
});
export const s3 = new AWS.S3();

const getMemeCollection = async () => {
  try {
    const resp = await s3
      .listObjectsV2({
        Bucket: "memehub",
        Prefix: "memehub/memes/",
      })
      .promise();
    if (!resp.Contents) {
      console.log("No Memes");
      return [];
    }
    return resp.Contents.map((item) => BUCKET_BASE_URL + item.Key);
  } catch (error) {
    console.log("error", error);
    return [];
  }
};

(async () => {
  const startTime = dayjs();
  const conn = await createTypeormConnection();
  let memeCollection = await getRedditMemes(conn);
  if (!memeCollection) {
    memeCollection = await getMemeCollection();
  }
  if (!memeCollection) {
    console.log("No Memes");
    return;
  }
  let current = getCurrent();
  await User.remove(await User.find());
  conn.createQueryBuilder().delete().from(Rank).execute();
  await createNewUsers(conn, current);
  let counter = 0;
  let now = dayjs();
  while (current < dayjs()) {
    const currentUsers = await getCurrentUsers(conn);
    await createNewUsers(conn, current);
    for (const userId of currentUsers) {
      const memes = [memeCollection[counter]];
      counter = (counter + 1) % memeCollection.length;
      await doPosting(conn, memes, userId, current);
      await doCommenting(conn, userId, current);
      await doMemeVoting(conn, userId, current);
      await doCommentVoting(conn, userId, current);
    }
    current = current.add(1, "h");
    await recordRank(conn, current);
    if (current.get("hour") === 0) {
      await logStats(current, now);
      now = dayjs();
    }
  }
  console.log(`Total Exec Time: ${dayjs().diff(startTime, "s")}`);
})();
