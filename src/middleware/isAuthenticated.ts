import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload } from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(400).json({ message: "Token not found" });
  }

  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
    req.user = tokenInfo;
    next();
  } catch (error:any ) {
    console.error(error.message, "Error.message");
    return res.status(401).json(error);
  }
};

export default isAuthenticated;