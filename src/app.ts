import { NextFunction, Request, Response } from "express";
import usersRouter from './routes/users';
import createHttpError, { isHttpError} from "http-errors";
require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(
    cors({
      origin: [process.env.CLIENT_URI]  
    })
  );

app.get("/", (req:Request, res:Response,) => {
    res.send("Hello world!!");
  })

  app.use('/users', usersRouter);
//   app.use('/auth', authRouter);
  
  app.use((req:Request, res:Response, next:NextFunction) => {
      next(createHttpError(404,"Endpoint not found"));
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: unknown, req:Request, res:Response, next:NextFunction) => {
      console.error(error);
      let errorMessage = "An unknown error occured";
      let statusCode = 500;
      if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
      }
      if (error instanceof Error) errorMessage = error.message;
      res.status(statusCode).json({error:errorMessage});
  });

export default app