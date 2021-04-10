import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { User } from "./../../user/entities/User";
import { Meme } from "./Meme";

@EventSubscriber()
export class MemeSubscriber implements EntitySubscriberInterface<Meme> {
  listenTo() {
    return Meme;
  }
  beforeInsert(event: InsertEvent<Meme>) {
    event.entity.id = v4();
  }
  async afterInsert(event: InsertEvent<Meme>) {
    const user = await User.findOne(event.entity.userId);
    if (user) {
      if (event.entity.isHive) {
        user.lastHivePost = event.entity.createdAt;
      } else {
        user.lastMemehubPost = event.entity.createdAt;
      }
      await User.save(user);
    }
  }
}
