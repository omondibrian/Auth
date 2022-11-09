/**
 * @fileOverview contains all the custom middleware used in the application
 * @author Brian Omondi
 * @version 0.0.1
 */

 import jwt from "jsonwebtoken";
 import { Request, Response, NextFunction } from "express";
 import Joi from "joi";
 export interface RequestModel extends Request {
   UserId: string;
   userMode: boolean;
 }
 export const TokenMiddleware = (
   req: any,
   res: Response,
   next: NextFunction
 ) => {
   const token = req.header("Authorization").split(" ").pop();
   console.log(token)
   if (!token) return res.status(401).send("ACCESS DENIED");
 
   try {
     const verifiedToken: any = jwt.verify(
       token,
       process.env.SECREATE_TOKEN as string
     );
     req.UserId = verifiedToken._id as string;
 
     next();
   } catch (error) {
     res.status(400).send("Invalid Token");
   }
 };
 


 export function ProfileValidation(req: any,
  res: Response,
  next: NextFunction){

  const schema = Joi.object({
    password: Joi.string(),
    name: Joi.string(),    
  });

  const result = schema.validate(req.body);
  if(result.error === undefined){
    next()
  } else {
    res.status(403).send("Invalid user request");
  }
}
