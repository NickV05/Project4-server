import { RequestHandler } from "express";
import axios from "axios";
import nodemailer from "nodemailer";
import { pool } from "../server"

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

export const subscribe: RequestHandler = (req, res, next) => {
  console.log("REQ>BODY ====>", req.body);
  const { email } = req.body;
  if (!email || email.trim() === "") {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      next(err);
    } else {
      connection.query(
        'INSERT INTO emails (email) VALUES (?)',
        [email],
        (insertErr) => {
          connection.release();

          if (insertErr) {
            console.error('Error inserting email into the database: ', insertErr);
            next(insertErr);
          } else {
            console.log("SUBSCRIBED EMAIL ===>", email);
            res.status(200).json({ message: "Email subscription successful." });
          }
        }
      );
    }
  });
};



