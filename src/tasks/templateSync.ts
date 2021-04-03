import dayjs from "dayjs";
import { In, Not } from "typeorm";
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
  let names: string[] = [];
  const templates = resp.Contents.map(async (item) => {
    if (item.Key) {
      const split = item.Key.split("/");
      const filename = split[split.length - 1];
      const [name] = filename.split(".");
      if (!name) return undefined;
      names.push(name);
      const url = BUCKET_BASE_URL + item.Key;
      const createdAt = dayjs()
        .set("h", 0)
        .set("m", 0)
        .set("s", 0)
        .set("ms", 0);
      const dbTemplate = await Template.findOne({ where: { name } });
      const newTemplate = Template.create({ name, url });
      const template = dbTemplate ? dbTemplate : newTemplate;
      try {
        await Market.create({
          createdAt,
          name,
          numPosts: 0,
          numUpvotes: 0,
          template,
        }).save();
      } catch (error) {}
      if (dbTemplate) return undefined;
      else return newTemplate;
    } else {
      return undefined;
    }
  });
  const newTemplates = (await Promise.all(templates)).filter(
    (template) => template !== undefined
  ) as Template[];
  Template.delete({ name: Not(In(names)) });
  Template.save(newTemplates);
};
