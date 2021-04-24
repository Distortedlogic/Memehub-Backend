import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { User } from "./../../user/entities/User";
import { Investment } from "./Investment";

@EventSubscriber()
export class MemeSubscriber implements EntitySubscriberInterface<Investment> {
  listenTo() {
    return Investment;
  }
  beforeInsert(event: InsertEvent<Investment>) {
    event.entity.id = v4();
  }
  async afterInsert(event: InsertEvent<Investment>) {
    const user = await User.findOne(event.entity.userId);
    if (user) {
      user.gbp -= event.entity.betSize;
      await User.save(user);
    }
  }
}
