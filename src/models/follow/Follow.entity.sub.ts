import {
  EntitySubscriberInterface,
  EventSubscriber,
  getConnection,
  InsertEvent,
} from "typeorm";
import { User } from "./../user/User.entity";
import { Follow } from "./Follow.entity";

@EventSubscriber()
export class FollowSubscriber implements EntitySubscriberInterface<Follow> {
  listenTo() {
    return Follow;
  }
  async afterInsert(event: InsertEvent<Follow>) {
    await getConnection()
      .getRepository(User)
      .increment({ id: event.entity.followingId }, "numFollowers", 1);
    await getConnection()
      .getRepository(User)
      .increment({ id: event.entity.followerId }, "numFollowing", 1);
  }
}
