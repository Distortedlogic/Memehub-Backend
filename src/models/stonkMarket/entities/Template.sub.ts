import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { v4 } from "uuid";
import { Template } from "./Template";

@EventSubscriber()
export class TemplateSubscriber implements EntitySubscriberInterface<Template> {
  listenTo() {
    return Template;
  }
  beforeInsert(event: InsertEvent<Template>) {
    event.entity.id = v4();
  }
}
