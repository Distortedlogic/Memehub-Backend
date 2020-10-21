import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { Rank } from "./../rank/Rank.entity";
import { User } from "./User.entity";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
  async afterInsert(event: InsertEvent<User>) {
    const createdAt = new Date(new Date().setMinutes(0, 0, 0));
    await Rank.create({
      createdAt,
      totalPoints: 0,
      rank: 0,
      userId: event.entity.id,
    }).save();
  }
}
