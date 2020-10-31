import multer from './middlewares/multer';
import { Router } from 'express';

const routes = Router();

import homeController from './app/controllers/homeController';
import productController from './app/controllers/productController';

// ================================ HOME ================================
routes.get("/", homeController.index);
routes.get("/about", homeController.about);
routes.get("/exchangesAndReturn", homeController.exchange);
routes.get("/privacy", homeController.privacy);

// ============================== PRODUCTS ==============================
routes.get("/products/show/:id", productController.show);
routes.get("/products/create", productController.create);
routes.get("/products/update/:id", productController.update);

routes.post("/products", multer.array("photos", 4), productController.post);
routes.put("/products", multer.array("photos", 4), productController.put);
routes.delete("/products", productController.delete);

export default routes;