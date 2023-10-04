import { RequestHandler } from "express";
import axios from "axios";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "nikita.valovyy@gmail.com",
    pass: "aearbttnkredizgj"
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

  const mailOptions = {
    from: `${name}, ${email}`,
    to: "nikita.valovyy@gmail.com",
    subject: "Project4",
    text: `From ${name}, ${email}. ${message}`
 };
 
 transporter.sendMail(mailOptions, function(error, info){
    if(error){
       console.log(error);
    }else{
       console.log("Email sent: " + info.response);
    }
 });

  res.status(200).json({ message: "Message received" });
};
