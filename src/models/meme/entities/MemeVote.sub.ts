import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { percent } from "../../../utils/functions/percent";
import { User } from "../../user/entities/User";
import { Meme } from "./Meme";
import { MemeVote } from "./MemeVote";

@EventSubscriber()
export class MemeVoteSubscriber implements EntitySubscriberInterface<MemeVote> {
  listenTo() {
    return MemeVote;
  }
  async afterInsert(event: InsertEvent<MemeVote>) {
    const voter = await User.findOne(event.entity.userId);
    if (!voter) {
      throw "no voter";
    }
    voter.numMemeVotesGiven++;
    const meme = await Meme.findOne(event.entity.memeId, {
      relations: ["user"],
    });
    if (!meme?.user) {
      throw "no meme or user";
    }
    if (event.entity.upvote) {
      meme.user.numMemeUpvotesRecieved++;
      meme.ups++;
    } else {
      meme.user.numMemeDownvotesRecieved++;
      meme.downs++;
    }
    meme.ratio = percent(meme);
    await voter.save();
    await meme.save();
  }
}
