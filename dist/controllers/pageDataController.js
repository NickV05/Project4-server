"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import nodemailer from "nodemailer";
import { pool } from "../server.js";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "nikita.valovyy@gmail.com",
        pass: "aearbttnkredizgj"
    }
});
export const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const umbrellaUrl = "https://expressapp.adaptable.app/forum/getblogs";
        const response = yield axios.get(umbrellaUrl);
        const data = response.data;
        console.log("Response ===>", data);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});

export const getTimeSlots = async (req, res, next) => {
    const { date } = req.body;
    console.log("REQ.BODY ===>", req.body);
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    console.log("YEAR ===>", year);
    console.log("MONTH ===>", month);
    console.log("DAY ===>", day);
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL: ', err);
        next(err);
      } else {
        connection.beginTransaction((beginTransactionErr) => {
          if (beginTransactionErr) {
            console.error('Error beginning transaction: ', beginTransactionErr);
            connection.release();
            next(beginTransactionErr);
          } else {
            console.log("TRANSACTION STARTED")
            connection.query('SELECT * FROM appoints WHERE year = ? AND month = ? AND date = ?', [year, month, day], (selectErr, results) => {
              if (selectErr) {
                console.error('Error executing SELECT query: ', selectErr);
                connection.release();
                next(selectErr);
              } else {
                if (results.length === 0) {
                  res.status(200).json({ message: "No appointments found for this date" });
                  connection.release();
                } else {
                  console.log("RESULTS ===>", results);
                  res.status(200).json(results);
                  connection.release();
                }
              }
            });
          }
        });
      }
    });
  };

export const ask = (req, res) => {
    console.log("RECEIVED BODY ===>", req.body);
    const { name, email, message } = req.body;
    const mailOptions = {
        from: `${name}, ${email}`,
        to: "nikita.valovyy@gmail.com",
        subject: "Project4",
        text: `From ${name}, ${email}. ${message}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
    res.status(200).json({ message: "Message received" });
};

export const subscribe = (req, res, next) => {
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
        }
        else {
            connection.query('INSERT INTO emails (email) VALUES (?)', [email], (insertErr) => {
                connection.release();
                if (insertErr) {
                    console.error('Error inserting email into the database: ', insertErr);
                    next(insertErr);
                }
                else {
                    console.log("SUBSCRIBED EMAIL ===>", email);
                    res.status(200).json({ message: "Email subscription successful." });
                }
            });
        }
    });
};
