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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = exports.ask = exports.getBlogs = void 0;
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Email_1 = __importDefault(require("../models/Email"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: "nikita.valovyy@gmail.com",
        pass: "aearbttnkredizgj"
    }
});
const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const umbrellaUrl = "https://expressapp.adaptable.app/forum/getblogs";
        const response = yield axios_1.default.get(umbrellaUrl);
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
    Email_1.default.create({ email })
        .then((createdEmail) => {
        console.log("SUBSCRIBED EMAIL ===>", createdEmail);
    })
        .catch((error) => {
        console.log(error);
        next(error);
    });
};
exports.subscribe = subscribe;
