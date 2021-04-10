import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { UserMemeEmoji } from "./UserMemeEmoji";

@EventSubscriber()
export class UserMemeEmojiSubscriber
  implements EntitySubscriberInterface<UserMemeEmoji> {
  listenTo() {
    return UserMemeEmoji;
  }
  beforeInsert(event: InsertEvent<UserMemeEmoji>) {
    event.entity.id = v4();
  }
}
