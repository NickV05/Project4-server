const { RequestHandler, Request, Response, NextFunction } = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { pool } = require("../server");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "nikita.valovyy@gmail.com",
    pass: "aearbttnkredizgj"
  }
});

export const getBlogs: typeof RequestHandler = async (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
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

export const ask: typeof RequestHandler = (req:typeof Request, res:typeof Response) => {
  console.log("RECEIVED BODY ===>", req.body);
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `${name}, ${email}`,
    to: "nikita.valovyy@gmail.com",
    subject: "Project4",
    text: `From ${name}, ${email}. ${message}`
 };
 
 transporter.sendMail(mailOptions, function(error:any, info:any){
    if(error){
       console.log(error);
    }else{
       console.log("Email sent: " + info.response);
    }
 });

  res.status(200).json({ message: "Message received" });
};

export const subscribe:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  console.log("REQ>BODY ====>", req.body);
  const { email } = req.body;
  if (!email || email.trim() === "") {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }
  pool.getConnection((err:any, connection:any) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      next(err);
    } else {
      connection.query(
        'INSERT INTO emails (email) VALUES (?)',
        [email],
        (insertErr:any) => {
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



