import { s3 } from "./../connections/awsConnection";
import { Emoji } from "./../models/emojis/Emoji.entity";

const BASE_AWS_S3_URL = "https://memehub.s3.amazonaws.com/";
export const emojiSync = async () => {
  const resp = await s3
    .listObjectsV2({
      Bucket: "memehub",
      Prefix: "memehub/emojis/",
    })
    .promise();
  if (!resp.Contents) return;
  const emojis = resp.Contents.map(async (item) => {
    if (item.Key) {
      const split = item.Key.split("/");
      const filename = split[split.length - 1];
      const [name] = filename.split(".");
      if (!name) return undefined;
      const url = BASE_AWS_S3_URL + item.Key;
      if (!(await Emoji.findOne(name))) {
        return Emoji.create({ name, url });
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  });
  const newEmojis = (await Promise.all(emojis)).filter(
    (emoji) => emoji !== undefined
  ) as Emoji[];
  Emoji.save(newEmojis);
};
