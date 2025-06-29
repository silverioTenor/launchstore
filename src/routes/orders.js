import { Router } from 'express';

const routes = Router();

import OrderController from '../app/controllers/OrderController.js';
import OrderValidator from '../app/validators/order.js';

import { onlyUsers as isLogged } from '../middlewares/session.js';

// Orders
routes.get("/purchases", isLogged, OrderController.index);
routes.get("/sales", isLogged, OrderController.sales);
routes.get("/order-success", OrderController.success);
routes.get("/order-failed", OrderController.failed);
routes.get("/:id", isLogged, OrderController.show);

routes.post("/", isLogged, OrderController.post);
routes.put("/:action/:id", isLogged, OrderValidator.updateStatus, OrderController.updateStatus);

export default routes;