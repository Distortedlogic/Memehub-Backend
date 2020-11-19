import { createHiveConnection } from "./../connections/hiveConnection";
import { User } from "./../models/user/User.entity";
import { BUCKET_BASE_URL } from "./../utils/constants";
export const runUpdate = async () => {
  const users = await User.find({ where: { avatar: "/defaultAvatar.png" } });
  const hive = await createHiveConnection();
  for (const user of users) {
    const [account] = await hive.database.getAccounts([user.username]);
    if (account) {
      try {
        user.avatar = JSON.parse(
          //@ts-ignore
          account.posting_json_metadata
        ).profile.profile_image;
      } catch (error) {
        console.log(error);
        try {
          user.avatar = JSON.parse(account.json_metadata).profile.profile_image;
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
