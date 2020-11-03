import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import UserController from '../app/controllers/UserController';

routes.get("/show/:id", UserController.show);
routes.get("/create", UserController.create);
routes.get("/update/:id", UserController.update);

routes.post("/", multer.array("photo", 1), UserController.post);
routes.put("/", multer.array("photo", 1), UserController.put);
routes.delete("/", UserController.delete);

export default routes;