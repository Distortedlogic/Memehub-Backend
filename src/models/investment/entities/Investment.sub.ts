import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Investment } from "./Investment";

@EventSubscriber()
export class MemeSubscriber implements EntitySubscriberInterface<Investment> {
  listenTo() {
    return Investment;
  }
  beforeInsert(event: InsertEvent<Investment>) {
    event.entity.id = v4();
  }
}
