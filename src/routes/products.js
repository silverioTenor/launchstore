import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import ProductController from '../app/controllers/ProductController';
import ProductValidator from '../app/validators/product';
import SearchController from '../app/controllers/SearchController';

import { onlyUsers } from '../middlewares/session';

routes.get("/search", SearchController.index);

routes.get("/create", onlyUsers, ProductController.create);
routes.get("/show/:id", ProductController.show);
routes.get("/update/:id", onlyUsers, ProductController.update);

routes.post("/", multer.array("photos", 4), ProductValidator.post, ProductController.post);
routes.put("/", multer.array("photos", 4), ProductValidator.put, ProductController.put);
routes.delete("/", ProductController.delete);

export default routes;