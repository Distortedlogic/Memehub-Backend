import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { User } from "./../../user/entities/User";
import { Trade } from "./Trade";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<Trade> {
  listenTo() {
    return Trade;
  }
  beforeInsert(event: InsertEvent<Trade>) {
    event.entity.id = v4();
  }
  async afterInsert(event: InsertEvent<Trade>) {
    const user = await User.findOne(event.entity.userId);
    if (user) {
      if (event.entity.type === "sell") {
        user!.gbp += event.entity.position * event.entity.price;
      } else if (event.entity.type === "buy") {
        user!.gbp -= event.entity.position * event.entity.price;
      }
      await User.save(user!);
    } else {
      throw new Error("bad insert no user");
    }
  }
}
