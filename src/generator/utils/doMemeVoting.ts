import dayjs from "dayjs";
import random from "random";
import { Connection } from "typeorm";
import { Meme } from "./../../models/meme/Meme.entity";
import { MemeVote } from "./../../models/meme/MemeVote.entity";
import { settings } from "./../settings";
export const doMemeVoting = async (
  conn: Connection,
  userId: string,
  current: dayjs.Dayjs
) => {
  const hasVoted: string[] = (
    await conn
      .createQueryBuilder()
      .select("vote.memeId", "memeId")
      .from(MemeVote, "vote")
      .where("vote.userId=:userId", { userId })
      .getRawMany()
  ).map((vote) => vote.memeId);
  let q = conn
    .createQueryBuilder()
    .select("meme.id", "id")
    .from(Meme, "meme")
    .orderBy("RANDOM()")
    .take(settings.numMemesToVote);
  if (hasVoted.length !== 0)
    q = q.where("meme.id NOT IN (:...hasVoted)", { hasVoted });
  const memes: string[] = (await q.getRawMany()).map((meme) => meme.id);
  await conn
    .createQueryBuilder()
    .insert()
    .into(MemeVote)
    .values(
      memes.map((memeId) => {
        return {
          memeId,
          userId,
          upvote: [true, true, true, false][random.int(0, 3)],
          createdAt: current.set("m", random.int(0, 59)).toDate(),
        };
      })
    )
    .execute();
};
