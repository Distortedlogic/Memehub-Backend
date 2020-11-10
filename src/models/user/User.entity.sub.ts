import dayjs from "dayjs";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LessThan,
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
          rank: numUsers,
          userId: event.entity.id,
        })
      )
    );

    const midnight = createdAt.set("h", 0);
    await Promise.all(
      ["ever", "day", "week", "month"].map((timeFrame) =>
        Array(32)
          .fill(32)
          .forEach(async (_, idx) => {
            const numUsers = await User.count({
              where: { createdAt: LessThan(midnight.add(idx, "d").toDate()) },
            });
            initRanks.push(
              Rank.create({
                createdAt: midnight.add(idx, "d").toDate(),
                totalPoints: 0,
                timeFrame,
                rank: numUsers,
                userId: event.entity.id,
              })
            );
          })
      )
    );
    await Rank.save(initRanks);
  }
}
