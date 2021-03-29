import dayjs from "dayjs";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Rank } from "../../rank/entities/Rank";
import { User } from "./User";

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
          mhp: 0,
          timeFrame,
          rank: numUsers + 1,
          userId: event.entity.id,
        })
      )
    );
    const midnight = createdAt.set("h", 0);
    const shift = createdAt.set("h", 0).diff(createdAt) === 0 ? 1 : 0;
    const numDays = 32 - shift;
    ["ever", "day", "week", "month"].forEach((timeFrame) =>
      Array(numDays)
        .fill(numDays)
        .forEach((_, idx) => {
          initRanks.push(
            Rank.create({
              createdAt: midnight.subtract(idx + shift, "d").toDate(),
              mhp: 0,
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
