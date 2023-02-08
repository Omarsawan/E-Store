'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const product_1 = require('../models/product');
const auth_1 = require('../helpers/auth');
const store = new product_1.ProductStore();
const index = async (req, res) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const show = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await store.show(id);
    res.json(product);
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
    // @ts-ignore
    const product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const newproduct = await store.create(product);
    res.json(newproduct);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const indexByCategory = async (req, res) => {
  try {
    const category_name = req.params.categoryName;
    const products = await store.indexByCategory(category_name);
    res.json(products);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};
const product_routes = (app) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', auth_1.verifyAuthToken, create);
  app.get('/products/category/:categoryName', indexByCategory);
};
exports.default = product_routes;
