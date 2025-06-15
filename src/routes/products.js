import multer from '../middlewares/multer.js';
import { Router } from 'express';

const routes = Router();

import ProductController from '../app/controllers/ProductController.js';
import ProductValidator from '../app/validators/product.js';
import SearchController from '../app/controllers/SearchController.js';

import { onlyUsers } from '../middlewares/session.js';

routes.get("/search", SearchController.index);

routes.get("/", ProductController.index);
routes.get("/create", onlyUsers, ProductController.create);
routes.get("/show/:id", ProductController.show);
routes.get("/update/:id", onlyUsers, ProductController.update);

routes.post("/", multer.array("photos", 4), ProductValidator.post, ProductController.post);
routes.put("/", multer.array("photos", 4), ProductValidator.put, ProductController.put);
routes.delete("/", ProductController.delete);

export default routes;