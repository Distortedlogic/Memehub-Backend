import { Client, CommentOperation } from "@hiveio/dhive";
import { Like } from "typeorm";
import { Comment } from "../models/comment/Entity/Comment.entity";
import { Meme } from "./../models/meme/Entity/Meme.entity";
import { User } from "./../models/user/User.entity";
import { HIVE_COMMUNITY } from "./../utils/constants";

export const hiveSync = async (hive: Client) => {
  for await (const block of hive.blockchain.getBlocks()) {
    for (const trans of block.transactions) {
      for (const op of trans.operations) {
        if (op[0] === "comment") {
          if (op[1].json_metadata.includes(HIVE_COMMUNITY)) {
            const data = op[1] as CommentOperation[1];
            if (data.parent_author.length !== 0) {
              const meme = await Meme.findOne({
                where: { url: Like(`%${data.parent_permlink}%`) },
              });
              let user = await User.findOne({
                where: { username: data.author },
              });
              if (meme) {
                if (!user) {
                  const [account] = await hive.database.getAccounts([
                    data.author,
                  ]);
                  const metadata = JSON.parse(account.json_metadata);
                  const avatar = metadata.profile.profile_image;
                  user = await User.create({
                    username: data.author,
                    avatar,
                    isHive: true,
                    verified: true,
                  }).save();
                }
                const comment = await Comment.find({
                  where: {
                    text: data.body,
                    memeId: meme.id,
                    userId: user.id,
                  },
                });
                if (!comment)
                  await Comment.create({
                    text: data.body,
                    memeId: meme.id,
                    userId: user.id,
                  }).save();
              }
            }
          }
        }
      }
    }
  }
};
