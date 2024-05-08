import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'wayliike@meta.ua',
    pass: process.env.META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async data => {
  const email = {
    ...data,
    from: 'wayliike@meta.ua',
  };

  await transport.sendMail(email);
  return true;
};
