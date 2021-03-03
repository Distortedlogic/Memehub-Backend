import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { percent } from "../../../utils/functions/percent";
import { User } from "../../user/entities/User";
import { Comment } from "./Comment";
import { CommentVote } from "./CommentVote";

@EventSubscriber()
export class CommentVoteSubscriber
  implements EntitySubscriberInterface<CommentVote> {
  listenTo() {
    return CommentVote;
  }
  async afterInsert(event: InsertEvent<CommentVote>) {
    const voter = await User.findOne(event.entity.userId);
    const comment = await Comment.findOne(event.entity.commentId, {
      relations: ["user"],
    });
    if (!comment?.user || !voter) {
      throw "no comment or user";
    }
    voter.numCommentVotesGiven++;
    if (event.entity.upvote) {
      comment.user.numCommentUpvotesRecieved++;
      comment.ups++;
    } else {
      comment.user.numCommentDownvotesRecieved++;
      comment.downs++;
    }
    comment.ratio = percent(comment);
    await comment.save();
    await voter.save();
  }
}
