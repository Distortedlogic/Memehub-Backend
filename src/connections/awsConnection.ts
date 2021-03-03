import AWS from "aws-sdk";
AWS.config.update({
  apiVersion: "2010-12-01",
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
  region: "us-east-1",
});
export const s3 = new AWS.S3();
// export const ses = new AWS.SES();
