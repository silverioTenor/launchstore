import multer from '../middlewares/multer.js';
import { Router } from 'express';

const routes = Router();

import UserValidator from '../app/validators/user.js';
import UserController from '../app/controllers/UserController.js';

import { onlyUsers as isLogged } from '../middlewares/session.js';

// Profile
routes.get("/profile/:id", isLogged, UserValidator.show, UserController.show);
routes.put("/", multer.array("photo", 1), UserValidator.update, UserController.update);
routes.delete("/", UserController.delete);

// User ads
routes.get("/:id/ads", UserController.ads);

export default routes;