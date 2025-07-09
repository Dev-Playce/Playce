import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({
  to,
  subject,
  html,
}: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.naver.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Playce" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
