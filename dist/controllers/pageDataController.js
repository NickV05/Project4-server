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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = exports.ask = exports.getBlogs = void 0;
import axios from "axios";
import nodemailer from "nodemailer";
import { pool } from "../server";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "nikita.valovyy@gmail.com",
        pass: "aearbttnkredizgj"
    }
});
const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getBlogs = getBlogs;
const ask = (req, res) => {
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
exports.ask = ask;
const subscribe = (req, res, next) => {
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
exports.subscribe = subscribe;
