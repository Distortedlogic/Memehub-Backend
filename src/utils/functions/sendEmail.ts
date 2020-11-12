import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { EMAIL } from "./../constants";

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_KEY!,
  })
);

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: EMAIL,
    to,
    subject,
    html,
  });
};
