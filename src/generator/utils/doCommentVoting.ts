import dayjs from "dayjs";
import random from "random";
import { Connection } from "typeorm";
import { Comment } from "../../models/comment/Entity/Comment.entity";
import { CommentVote } from "../../models/comment/Entity/CommentVote.entity";
import { settings } from "./../settings";

export const doCommentVoting = async (
  conn: Connection,
  userId: string,
  current: dayjs.Dayjs
) => {
  const hasVoted: string[] = (
    await conn
      .createQueryBuilder()
      .select("vote.commentId", "commentId")
      .from(CommentVote, "vote")
      .where("vote.userId=:userId", { userId })
      .getRawMany()
  ).map((vote) => vote.commentId);
  let q = conn
    .createQueryBuilder()
    .select("comment.id", "id")
    .from(Comment, "comment")

    .orderBy("RANDOM()")
    .take(settings.numCommentsToVote);
  if (hasVoted.length !== 0)
    q = q.where("comment.id NOT IN (:...hasVoted)", { hasVoted });
  const comments: string[] = (await q.getRawMany()).map(
    (comment) => comment.id
  );
  await conn
    .createQueryBuilder()
    .insert()
    .into(CommentVote)
    .values(
      comments.map((commentId) => ({
        commentId,
        userId,
        upvote: [true, true, true, false][random.int(0, 3)],
        createdAt: current.set("m", random.int(0, 59)).toDate(),
      }))
    )
    .execute();
};
