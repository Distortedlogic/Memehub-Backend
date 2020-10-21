import nodemailer from "nodemailer";

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  const testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
