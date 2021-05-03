import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { percent } from "../../../utils/functions/percent";
import { Meme } from "./Meme";
import { MemeVote } from "./MemeVote";

@EventSubscriber()
export class MemeVoteSubscriber implements EntitySubscriberInterface<MemeVote> {
  listenTo() {
    return MemeVote;
  }
  async afterInsert(event: InsertEvent<MemeVote>) {
    const meme = await Meme.findOne(event.entity.memeId);
    if (!meme) {
      throw "no meme";
    } else {
      meme.ratio = percent(meme);
      await meme.save();
    }
  }
}
