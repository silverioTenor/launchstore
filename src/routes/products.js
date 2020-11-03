import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import ProductController from '../app/controllers/ProductController';

routes.get("/show/:id", ProductController.show);
routes.get("/create", ProductController.create);
routes.get("/update/:id", ProductController.update);

routes.post("/", multer.array("photos", 4), ProductController.post);
routes.put("/", multer.array("photos", 4), ProductController.put);
routes.delete("/", ProductController.delete);

export default routes;