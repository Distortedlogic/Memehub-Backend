import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Emoji } from "./Emoji";

@EventSubscriber()
export class EmojiSubscriber implements EntitySubscriberInterface<Emoji> {
  listenTo() {
    return Emoji;
  }
  beforeInsert(event: InsertEvent<Emoji>) {
    event.entity.id = v4();
  }
}
