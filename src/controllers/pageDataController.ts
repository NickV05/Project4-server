import { RequestHandler } from "express";
import axios from "axios";
import nodemailer, { SentMessageInfo } from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  }
});

export const getBlogs: RequestHandler = async (req, res, next) => {
  try {
    const umbrellaUrl = "https://expressapp.adaptable.app/forum/getblogs"; 
    const response = await axios.get(umbrellaUrl);
    const data = response.data;
    console.log("Response ===>", data);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const ask: RequestHandler = (req, res) => {
  console.log("RECEIVED BODY ===>", req.body);
  const { name, email, message } = req.body;

  transporter.sendMail({
    from: `${name} <${email}>`,
    to: 'nikita.valovyy@gmail.com', 
    subject: 'Project4', 
    text: `${message}`,
    html: `<b>${message}</b>`
  })
  .then((info: SentMessageInfo) => console.log(info))
  .catch((error: Error) => console.log(error));

  res.status(200).json({ message: "Message received" });
};

