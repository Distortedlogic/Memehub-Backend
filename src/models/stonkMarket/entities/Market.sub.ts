import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Market } from "./Market";

@EventSubscriber()
export class MarketSubscriber implements EntitySubscriberInterface<Market> {
  listenTo() {
    return Market;
  }
  beforeInsert(event: InsertEvent<Market>) {
    event.entity.id = v4();
  }
}
