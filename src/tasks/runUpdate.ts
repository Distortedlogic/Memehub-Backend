import { createHiveConnection } from "./../connections/hiveConnection";
import { User } from "./../models/user/User.entity";
import { BUCKET_BASE_URL } from "./../utils/constants";
export const runUpdate = async () => {
  const users = await User.find({ where: { avatar: "/defaultAvatar.png" } });
  const hive = await createHiveConnection();
  for (const user of users) {
    const [account] = await hive.database.getAccounts([user.username]);
    if (account) {
      //@ts-ignore
      const pjd = JSON.parse(account.posting_json_metadata);
      const jd = JSON.parse(account.json_metadata);
      user.avatar = pjd ? pjd.profile.profile_image : jd.profile.profile_image;
    } else {
      user.avatar = `${BUCKET_BASE_URL}/misc/defaultAvatar.png`;
    }
  }
  await User.save(users);
};
