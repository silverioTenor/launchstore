import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import UserValidator from '../app/validators/user';
import UserController from '../app/controllers/UserController';
import OrderController from '../app/controllers/OrderController';

import { onlyUsers as isLogged } from '../middlewares/session';

// Profile
routes.get("/profile/:id", isLogged, UserValidator.show, UserController.show);
routes.put("/", multer.array("photo", 1), UserValidator.update, UserController.update);
routes.delete("/", UserController.delete);

// User ads
routes.get("/:id/ads", UserController.ads);

// Orders
routes.get("/order-success", OrderController.success);
routes.get("/order-failed", OrderController.failed);
routes.post("/orders", OrderController.post);

export default routes;