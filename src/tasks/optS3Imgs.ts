import { s3 } from "./../connections/awsConnection";
export const optS3Imgs = async () => {
  const resp = await s3
    .listObjectsV2({
      Bucket: "memehub",
      Prefix: "memehub/",
    })
    .promise();
  if (!resp.Contents) return;
  for (const item of resp.Contents) {
    if (item.Key?.split(".")[1]) {
      // const img = await s3
      //   .getObject({ Bucket: "memehub", Key: item.Key! })
      //   .promise();
      // const file = await jimp.read(
      //   Buffer.from(img.Body as Buffer).toString("base64")
      // );
      // file;
      // console.log(await file.quality(80).getBufferAsync("jpg"));
      // s3.putObject({Bucket:"memehub",Key:item.Key, Body: await file.quality(80).getBufferAsync('jpg')})
      throw new Error();
      // console.log(item.Key);
      // console.log(img);
      // const optImg = await sharp(img.Body as Buffer)
      //   .jpeg()
      //   .toBuffer();
      // console.log(optImg);
    }
  }
  return;
};
