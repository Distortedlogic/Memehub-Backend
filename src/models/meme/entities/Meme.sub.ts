import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Meme } from "./Meme";

@EventSubscriber()
export class MemeSubscriber implements EntitySubscriberInterface<Meme> {
  listenTo() {
    return Meme;
  }
  beforeInsert(event: InsertEvent<Meme>) {
    event.entity.id = v4();
  }
}
