const express = require("express");
const { Request, Response, NextFunction } = express;
const jwt = require("jsonwebtoken");
const { JwtPayload } = jwt;

declare module "express" {
  interface Request {
    user?: typeof JwtPayload;
  }
}

const isAuthenticated = async (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(400).json({ message: "Token not found" });
  }

  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET as string) as typeof JwtPayload ;
    req.user = tokenInfo;
    next();
  } catch (error:any ) {
    console.error(error.message, "Error.message");
    return res.status(401).json(error);
  }
};

export default isAuthenticated;