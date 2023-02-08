'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const user_1 = require('../models/user');
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const auth_1 = require('../helpers/auth');
const store = new user_1.UserStore();
const index = async (req, res) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const show = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const create = async (req, res) => {
  try {
    // @ts-ignore
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };
    const newuser = await store.create(user);
    const token = jsonwebtoken_1.default.sign(
      { user: newuser },
      process.env.TOKEN_SECRET
    );
    res.json(token);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const authenticate = async (req, res) => {
  try {
    // @ts-ignore
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };
    const loggedinUser = await store.authenticate(
      user.first_name,
      user.last_name,
      user.password
    );
    const token = jsonwebtoken_1.default.sign(
      { user: loggedinUser },
      process.env.TOKEN_SECRET
    );
    res.json(token);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const user_routes = (app) => {
  app.get('/users', auth_1.verifyAuthToken, index);
  app.get('/users/:id', auth_1.verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/signin', authenticate);
};
exports.default = user_routes;
