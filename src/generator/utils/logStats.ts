import dayjs from "dayjs";
import { Comment } from "../../models/comment/entities/Comment";
import { CommentVote } from "../../models/comment/entities/CommentVote";
import { Meme } from "../../models/meme/entities/Meme";
import { MemeVote } from "../../models/meme/entities/MemeVote";
import { Follow } from "./../../models/follow/entities/Follow";
import { User } from "./../../models/user/entities/User";

export const logStats = async (current: dayjs.Dayjs, now: dayjs.Dayjs) => {
  console.log(`\n\n\n\n\n\n\n\n\n\n`);
  console.log(current.toDate());
  console.log(`Exec Time: ${dayjs().diff(now, "s")}`);
  console.log(`Number of Users: ${await User.count()}`);
  console.log(`Number of Memes: ${await Meme.count()}`);
  console.log(`Number of Comments: ${await Comment.count()}`);
  console.log(`Number of Follows: ${await Follow.count()}`);
  console.log(`Number of MemeVotes: ${await MemeVote.count()}`);
  console.log(`Number of CommentVote: ${await CommentVote.count()}`);
  console.log(`\n\n\n\n\n\n\n\n\n\n`);
};
