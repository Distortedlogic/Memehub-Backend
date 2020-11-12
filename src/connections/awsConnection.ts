import AWS from "aws-sdk";
AWS.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
});
export const s3 = new AWS.S3();
export const ses = new AWS.SES();
