import { RequestHandler } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser:RequestHandler = async (req, res, next) => {
    try{
        const users = await User.find().exec();
        res.status(200).json(users);
    }
    catch(error){
     next(error);   
    }
}

export const createUser:RequestHandler = (req, res, next) => {
    const saltRounds = 10;
    const { email, password, fullName, location, username  } = req.body;
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
    
      User.findOne({ email })
        .then((foundUser) => {
    
          if (foundUser) {
            res.status(400).json({ message: "User already exists." });
            return;
          }
    
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(password, salt);
    
          User.create({ email, password: hashedPassword, fullName, location, username, image:"https://res.cloudinary.com/dyto7dlgt/image/upload/v1691526692/project3/avatar_h1b0st.jpg" })
            .then((createdUser) => {
    
              const { email, _id, fullName, location, username, image } = createdUser;
    
              const payload = { email, _id, fullName, location, username, image };
    
              const authToken = jwt.sign(payload, process.env.SECRET as string, {
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
}

export const login:RequestHandler = (req, res, next) => {
    const { email, password } = req.body;
  
    if (email === "" || password === "") {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }
  
    User.findOne({ email })
      .then((foundUser) => {
        if (!foundUser) {
  
          res.status(401).json({ message: "User not found." });
          return;
        }
  
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
  
        if (passwordCorrect) {
  
          const { email, _id, fullName, location, username, image} = foundUser;
  
          const payload = { email, _id, fullName, location, username, image};
  
          const authToken = jwt.sign(payload, process.env.SECRET as string, {
            algorithm: "HS256",
            expiresIn: "6h",
          });
  
          res.status(200).json({ authToken });
        } else {
          res.status(401).json({ message: "Unable to authenticate the user" });
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  };