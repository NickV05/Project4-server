import { RequestHandler } from "express";
import User from "../models/User";
export const getUser:RequestHandler = async (req, res, next) => {
    try{
        const users = await User.find().exec();
        res.status(200).json(users);
    }
    catch(error){
     next(error);   
    }
}