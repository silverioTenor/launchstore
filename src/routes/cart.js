import { Router } from 'express';

const routes = Router();

import CartController from '../app/controllers/CartController';
import OrderController from '../app/controllers/OrderController';

routes.get("/", CartController.index);
routes.post("/add/:id", CartController.addOne);
routes.post("/remove/:id", CartController.removeOne);
routes.delete("/delete/:id", CartController.delete);

// Orders
routes.get("/order-success", OrderController.success);
routes.get("/order-failed", OrderController.failed);
routes.post("/", OrderController.post);

export default routes;