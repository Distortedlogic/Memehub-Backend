import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { Meme } from "./../meme/Meme.entity";
import { Comment } from "./Comment.entity";

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }
  async afterInsert(event: InsertEvent<Comment>) {
    const meme = await Meme.findOne(event.entity.memeId, {
      relations: ["user"],
    });
    if (!meme?.user) throw "no meme or user";
    meme.numComments++;
    meme.user.numMemeCommentsRecieved++;
    await meme.save();
  }
}
