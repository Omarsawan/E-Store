import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const verifyAuthToken = (req: Request, res: Response, next: Function) => {
  if (!req.headers.authorization) {
    res.status(403).send('No credentials sent!');
    return;
  }
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    res.set('Authorization', authorizationHeader);
    next();
  } catch (error) {
    res.status(401).send(`invalid token ${error}`);
  }
};

const getUserIdFromToken = (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization as string;
  const token = authorizationHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

  //@ts-ignore
  return decoded.user.id as string;
};

export { verifyAuthToken, getUserIdFromToken };
