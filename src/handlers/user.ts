import { User, UserStore } from '../models/user';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '../helpers/auth';

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };

    const newuser = await store.create(user);
    const token = jwt.sign(
      { user: newuser },
      process.env.TOKEN_SECRET as string
    );
    res.json(token);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const authenticate = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };

    const loggedinUser = await store.authenticate(
      user.first_name,
      user.last_name,
      user.password
    );
    const token = jwt.sign(
      { user: loggedinUser },
      process.env.TOKEN_SECRET as string
    );
    res.json(token);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/signin', authenticate);
};

export default user_routes;
