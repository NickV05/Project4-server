"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.login = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res, next) => {
    const saltRounds = 10;
    const { email, password, fullName, location, username } = req.body;
    if (email === "") {
        res.status(400).json({ message: "Please provide email." });
        return;
    }
    if (password === "") {
        res.status(400).json({ message: "Please provide password." });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Please provide a valid email address." });
        return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    if (fullName === "") {
        res.status(400).json({ message: 'Please provide your full name.' });
        return;
    }
    if (location === "") {
        res.status(400).json({ message: 'Please provide your location.' });
        return;
    }
    if (username === "") {
        res.status(400).json({ message: 'Please provide your username.' });
        return;
    }
    User_1.default.findOne({ email })
        .then((foundUser) => {
        if (foundUser) {
            res.status(400).json({ message: "User already exists." });
            return;
        }
        const salt = bcryptjs_1.default.genSaltSync(saltRounds);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        User_1.default.create({ email, password: hashedPassword, fullName, location, username, image: "https://res.cloudinary.com/dyto7dlgt/image/upload/v1691526692/project3/avatar_h1b0st.jpg" })
            .then((createdUser) => {
            const { email, _id, fullName, location, username, image } = createdUser;
            const payload = { email, _id, fullName, location, username, image };
            const authToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET, {
                algorithm: "HS256",
                expiresIn: "6h",
            });
            res.status(200).json({ authToken });
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    })
        .catch((err) => {
        console.log(err);
        next(err);
    });
};
exports.createUser = createUser;
const login = (req, res, next) => {
    const { email, password } = req.body;
    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }
    User_1.default.findOne({ email })
        .then((foundUser) => {
        if (!foundUser) {
            res.status(401).json({ message: "User not found." });
            return;
        }
        const passwordCorrect = bcryptjs_1.default.compareSync(password, foundUser.password);
        if (passwordCorrect) {
            const { email, _id, fullName, location, username, image } = foundUser;
            const payload = { email, _id, fullName, location, username, image };
            const authToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET, {
                algorithm: "HS256",
                expiresIn: "6h",
            });
            res.status(200).json({ authToken });
        }
        else {
            res.status(401).json({ message: "Unable to authenticate the user" });
        }
    })
        .catch((err) => {
        console.log(err);
        next(err);
    });
};
exports.login = login;
const verify = (req, res) => {
    console.log("req.user", req.user);
    res.status(200).json(req.user);
};
exports.verify = verify;
