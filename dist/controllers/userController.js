"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.login = exports.createUser = void 0;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../server.js";
const createUser = (req, res, next) => {
    const saltRounds = 10;
    const { email, password, fullName, location, username } = req.body;
    console.log("REQ.BODY ===>", req.body);
    if (email === "" || password === "" || fullName === "" || location === "" || username === "") {
        res.status(400).json({ message: "Please provide all required fields." });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Please provide a valid email address." });
        return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({
            message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
        });
        return;
    }
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL: ', err);
            next(err);
        }
        else {
            connection.beginTransaction((beginTransactionErr) => {
                if (beginTransactionErr) {
                    console.error('Error beginning transaction: ', beginTransactionErr);
                    connection.release();
                    next(beginTransactionErr);
                }
                else {
                    connection.query('SELECT * FROM users WHERE email = ?', [email], (selectErr, results) => {
                        if (selectErr) {
                            console.error('Error executing SELECT query: ', selectErr);
                            connection.rollback(() => {
                                connection.release();
                                next(selectErr);
                            });
                        }
                        else {
                            if (results.length > 0) {
                                res.status(400).json({ message: "User already exists." });
                                connection.rollback(() => {
                                    connection.release();
                                });
                            }
                            else {
                                const salt = bcrypt.genSaltSync(saltRounds);
                                const hashedPassword = bcrypt.hashSync(password, salt);
                                connection.query('INSERT INTO users (email, password, fullName, location, username, image) VALUES (?, ?, ?, ?, ?, ?)', [email, hashedPassword, fullName, location, username, "https://res.cloudinary.com/dyto7dlgt/image/upload/v1691526692/project3/avatar_h1b0st.jpg"], (insertErr, results) => {
                                    if (insertErr) {
                                        console.error('Error executing INSERT query: ', insertErr);
                                        connection.rollback(() => {
                                            connection.release();
                                            next(insertErr);
                                        });
                                    }
                                    else {
                                        connection.commit((commitErr) => {
                                            if (commitErr) {
                                                console.error('Error committing transaction: ', commitErr);
                                                connection.rollback(() => {
                                                    connection.release();
                                                    next(commitErr);
                                                });
                                            }
                                            else {
                                                const userId = results.insertId;
                                                const payload = { email, _id: userId, fullName, location, username, image: "https://res.cloudinary.com/dyto7dlgt/image/upload/v1691526692/project3/avatar_h1b0st.jpg" };
                                                const authToken = jwt.sign(payload, process.env.SECRET, {
                                                    algorithm: "HS256",
                                                    expiresIn: "6h",
                                                });
                                                res.status(200).json({ authToken });
                                                connection.release();
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};
exports.createUser = createUser;
const login = (req, res, next) => {
    const { email, password } = req.body;
    console.log("REQ.BODY ===>", req.body);
    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL: ', err);
            next(err);
        }
        else {
            connection.query('SELECT * FROM users WHERE email = ?', [email], (selectErr, results) => {
                if (selectErr) {
                    console.error('Error executing SELECT query: ', selectErr);
                    connection.release();
                    next(selectErr);
                }
                else {
                    if (results.length === 0) {
                        res.status(401).json({ message: "User not found." });
                        connection.release();
                    }
                    else {
                        const foundUser = results[0];
                        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
                        if (passwordCorrect) {
                            const { email, id, fullName, location, username, image } = foundUser;
                            const payload = { email, _id: id, fullName, location, username, image };
                            const authToken = jwt.sign(payload, process.env.SECRET, {
                                algorithm: "HS256",
                                expiresIn: "6h",
                            });
                            res.status(200).json({ authToken });
                            connection.release();
                        }
                        else {
                            res.status(401).json({ message: "Unable to authenticate the user" });
                            connection.release();
                        }
                    }
                }
            });
        }
    });
};
exports.login = login;
const verify = (req, res) => {
    console.log("req.user", req.user);
    res.status(200).json(req.user);
};
exports.verify = verify;
