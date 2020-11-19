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
        console.log(
          "account.posting_json_metadata",
          //@ts-ignore
          account.posting_json_metadata
        );
        //@ts-ignore
        const theJson = JSON.parse(account.posting_json_metadata);
        user.avatar = theJson.profile.profile_image;
      } catch (error) {
        try {
          console.log("account.json_metadata", account.json_metadata);
          const theJson = JSON.parse(account.json_metadata);
          user.avatar = theJson.profile.profile_image;
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
