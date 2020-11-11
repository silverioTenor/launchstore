import multer from '../middlewares/multer';
import { Router } from 'express';

import ProductController from '../app/controllers/ProductController';
import { onlyUsers } from '../middlewares/session';
const routes = Router();

routes.get("/create", onlyUsers, ProductController.create);
routes.get("/show/:id", ProductController.show);
routes.get("/update/:id", onlyUsers, ProductController.update);

routes.post("/", multer.array("photos", 4), ProductController.post);
routes.put("/", multer.array("photos", 4), ProductController.put);
routes.delete("/", ProductController.delete);

export default routes;