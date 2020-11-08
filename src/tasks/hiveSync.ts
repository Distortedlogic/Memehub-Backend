import { Client, CommentOperation } from "@hiveio/dhive";
import { Like } from "typeorm";
import { Comment } from "./../models/comment/Comment.entity";
import { Meme } from "./../models/meme/Meme.entity";
import { User } from "./../models/user/User.entity";

export const hiveSync = async (hive: Client) => {
  for await (const block of hive.blockchain.getBlocks()) {
    for (const trans of block.transactions) {
      for (const op of trans.operations) {
        if (
          op[0] === "comment" &&
          op[1].json_metadata.includes("hive-189111")
        ) {
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
};
