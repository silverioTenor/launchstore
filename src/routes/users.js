import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import UserValidator from '../app/validators/user';
import UserController from '../app/controllers/UserController';

import { onlyUsers as isLogged } from '../middlewares/session';

routes.get("/profile/:id", isLogged, UserValidator.show, UserController.show);
routes.put("/", multer.array("photo", 1), UserValidator.update, UserController.update);
routes.delete("/", UserController.delete);

routes.get("/:id/ads", UserController.ads);

export default routes;