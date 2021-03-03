import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Meme } from "../../meme/entities/Meme";
import { Comment } from "./Comment";

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
  beforeInsert(event: InsertEvent<Comment>) {
    event.entity.id = v4();
  }
}
