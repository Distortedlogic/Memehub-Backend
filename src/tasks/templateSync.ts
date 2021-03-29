import dayjs from "dayjs";
import { s3 } from "../connections/awsConnection";
import { BUCKET_BASE_URL } from "../utils/constants";
import { Market } from "./../models/stonkMarket/entities/Market";
import { Template } from "./../models/stonkMarket/entities/Template";

export const templateSync = async () => {
  const resp = await s3
    .listObjectsV2({
      Bucket: "memehub",
      Prefix: "memehub/templates/",
    })
    .promise();
  if (!resp.Contents) return;
  const templates = resp.Contents.map(async (item) => {
    if (item.Key) {
      const split = item.Key.split("/");
      const filename = split[split.length - 1];
      const [name] = filename.split(".");
      if (!name) return undefined;
      const url = BUCKET_BASE_URL + item.Key;
      const createdAt = dayjs().set("h", 0).set("m", 0).set("ms", 0);
      if (!(await Template.findOne(name))) {
        await Market.create({
          createdAt,
          name,
          numPosts: 0,
          numUpvotes: 0,
          source: "start",
          subsource: "start",
        }).save();
        return Template.create({ name, url });
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  });
  const newTemplates = (await Promise.all(templates)).filter(
    (template) => template !== undefined
  ) as Template[];
  Template.save(newTemplates);
};
