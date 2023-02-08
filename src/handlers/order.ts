import { Order, OrderStore } from '../models/order';
import express, { Request, Response } from 'express';
import { verifyAuthToken, getUserIdFromToken } from '../helpers/auth';

const store = new OrderStore();

const activeOrder = async (req: Request, res: Response) => {
  try {
    const user_id = getUserIdFromToken(req, res);
    const order = await store.activeOrder(user_id);
    res.json(order);
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
    const neworder = await store.create(getUserIdFromToken(req, res));
    res.json(neworder);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const productId: string = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);

  try {
    const addedProduct = await store.addProduct(
      quantity,
      orderId,
      productId,
      getUserIdFromToken(req, res)
    );
    res.json(addedProduct);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal error, please try again');
    }
  }
};

const order_routes = (app: express.Application) => {
  app.get('/orders/:userId', verifyAuthToken, activeOrder);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

export default order_routes;
