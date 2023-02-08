'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const order_1 = require('../models/order');
const auth_1 = require('../helpers/auth');
const store = new order_1.OrderStore();
const activeOrder = async (req, res) => {
  try {
    const user_id = (0, auth_1.getUserIdFromToken)(req, res);
    const order = await store.activeOrder(user_id);
    res.json(order);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const create = async (req, res) => {
  try {
    const neworder = await store.create(
      (0, auth_1.getUserIdFromToken)(req, res)
    );
    res.json(neworder);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const addProduct = async (req, res) => {
  const orderId = req.params.id;
  const productId = req.body.productId;
  const quantity = parseInt(req.body.quantity);
  try {
    const addedProduct = await store.addProduct(
      quantity,
      orderId,
      productId,
      (0, auth_1.getUserIdFromToken)(req, res)
    );
    res.json(addedProduct);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const order_routes = (app) => {
  app.get('/orders/:userId', auth_1.verifyAuthToken, activeOrder);
  app.post('/orders', auth_1.verifyAuthToken, create);
  app.post('/orders/:id/products', auth_1.verifyAuthToken, addProduct);
};
exports.default = order_routes;
