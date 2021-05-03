import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { percent } from "../../../utils/functions/percent";
import { Comment } from "./Comment";
import { CommentVote } from "./CommentVote";

@EventSubscriber()
export class CommentVoteSubscriber
  implements EntitySubscriberInterface<CommentVote> {
  listenTo() {
    return CommentVote;
  }
  async afterInsert(event: InsertEvent<CommentVote>) {
    const comment = await Comment.findOne(event.entity.commentId);
    if (!comment) {
      throw "no comment";
    }
    comment.ratio = percent(comment);
    await comment.save();
  }
}
