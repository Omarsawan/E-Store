import { Product, ProductStore } from '../models/product';
import express, { Request, Response } from 'express';
import { verifyAuthToken } from '../helpers/auth';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await store.show(id);
    res.json(product);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const create = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };

    const newproduct = await store.create(product);
    res.json(newproduct);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const indexByCategory = async (req: Request, res: Response) => {
  try {
    const category_name = req.params.categoryName as string;
    const products = await store.indexByCategory(category_name);
    res.json(products);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.get('/products/category/:categoryName', indexByCategory);
};

export default product_routes;
