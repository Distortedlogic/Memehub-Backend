import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Rank } from "./../rank/Rank.entity";
import { User } from "./User.entity";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
  beforeInsert(event: InsertEvent<User>) {
    event.entity.id = v4();
  }
  async afterInsert(event: InsertEvent<User>) {
    const numUsers = await User.count();
    const createdAt = new Date(event.entity.createdAt.setMinutes(0, 0, 0));
    const initRanks = ["ever", "day", "week", "month"].map((timeFrame) =>
      Rank.create({
        createdAt,
        totalPoints: 0,
        timeFrame,
        rank: numUsers,
        userId: event.entity.id,
      })
    );
    await Rank.save(initRanks);
  }
}
