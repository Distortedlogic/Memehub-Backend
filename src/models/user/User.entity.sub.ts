import dayjs from "dayjs";
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
    let initRanks: Rank[] = [];
    const createdAt = dayjs(event.entity.createdAt.setMinutes(0, 0, 0));
    ["ever", "day", "week", "month"].forEach((timeFrame) =>
      initRanks.push(
        Rank.create({
          createdAt: createdAt.toDate(),
          totalPoints: 0,
          timeFrame,
          rank: numUsers + 1,
          userId: event.entity.id,
        })
      )
    );
    const midnight = createdAt.set("h", 0);
    ["ever", "day", "week", "month"].map((timeFrame) =>
      Array(32)
        .fill(32)
        .map((_, idx) => {
          initRanks.push(
            Rank.create({
              createdAt: midnight.subtract(idx, "d").toDate(),
              totalPoints: 0,
              timeFrame,
              rank: numUsers + 1,
              userId: event.entity.id,
            })
          );
        })
    );
    await Rank.save(initRanks);
  }
}
