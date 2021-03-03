import { In, Not } from "typeorm";
import { Rank } from "../models/rank/entities/Rank";
import { User } from "../models/user/entities/User";
import { createHiveConnection } from "./../connections/hiveConnection";
import { BUCKET_BASE_URL } from "./../utils/constants";
export const runUpdate = async () => {
  const users = await User.find({ where: { avatar: "/defaultAvatar.png" } });
  const hive = await createHiveConnection();
  await Rank.remove(
    await Rank.find({
      where: { userId: Not(In((await User.find()).map((user) => user.id))) },
    })
  );

  for (const user of users) {
    const [account] = await hive.database.getAccounts([user.username]);
    if (account) {
      try {
        //@ts-ignore
        const theJson = JSON.parse(account.posting_json_metadata);
        const avatar = theJson.profile.profile_image;
        if (avatar) user.avatar = avatar;
        else user.avatar = `${BUCKET_BASE_URL}/misc/defaultAvatar.png`;
      } catch (error) {
        try {
          const theJson = JSON.parse(account.json_metadata);
          const avatar = theJson.profile.profile_image;
          if (avatar) user.avatar = avatar;
          else user.avatar = `${BUCKET_BASE_URL}/misc/defaultAvatar.png`;
        } catch (error) {
          user.avatar = `${BUCKET_BASE_URL}/misc/defaultAvatar.png`;
        }
      }
    } else {
      user.avatar = `${BUCKET_BASE_URL}/misc/defaultAvatar.png`;
    }
  }
  await User.save(users);
};
