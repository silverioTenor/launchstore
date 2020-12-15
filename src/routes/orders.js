import { Router } from 'express';

const routes = Router();

import OrderController from '../app/controllers/OrderController';

import { onlyUsers as isLogged } from '../middlewares/session';

// Orders
routes.get("/order-success", OrderController.success);
routes.get("/order-failed", OrderController.failed);
routes.post("/", isLogged, OrderController.post);

export default routes;