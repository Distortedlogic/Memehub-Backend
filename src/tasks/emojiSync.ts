import { In, Not } from "typeorm";
import { Emoji } from "../models/emojis/entities/Emoji";
import { BUCKET_BASE_URL } from "../utils/constants";
import { s3 } from "./../connections/awsConnection";

export const emojiSync = async () => {
  await Emoji.delete({});
  const resp = await s3
    .listObjectsV2({
      Bucket: "memehub",
      Prefix: "memehub/emojis/",
    })
    .promise();
  if (!resp.Contents) return;
  let names: string[] = [];
  const emojis = resp.Contents.map(async (item) => {
    if (item.Key) {
      const split = item.Key.split("/");
      const filename = split[split.length - 1];
      const [name] = filename.split(".");
      if (!name) return undefined;
      names.push(name);
      const url = BUCKET_BASE_URL + item.Key;
      if (!(await Emoji.findOne({ where: { name } }))) {
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
  await Emoji.delete({ name: Not(In(names)) });
  await Emoji.save(newEmojis);
};
