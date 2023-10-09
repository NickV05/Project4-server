import usersRouter from './routes/users.js';
import pageRouter from './routes/pageData.js';
import createHttpError, { isHttpError } from "http-errors";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.enable('trust proxy');
app.use(cors({
    origin: [process.env.CLIENT_URI]
}));
app.get("/", (req, res) => {
    res.send("Hello world!!");
});
app.use('/users', usersRouter);
app.use('/pageData', pageRouter);
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    if (error instanceof Error)
        errorMessage = error.message;
    res.status(statusCode).json({ error: errorMessage });
});
export default app;
