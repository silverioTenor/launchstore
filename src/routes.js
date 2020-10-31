import multer from './middlewares/multer';
import { Router } from 'express';

const routes = Router();

import homeController from './app/controllers/homeController';
import productController from './app/controllers/productController';
import searchController from './app/controllers/searchController';


// ================================ HOME ================================
routes.get("/", homeController.index);

// =============================== SEARCH ===============================
routes.get("/products/search", searchController.index);

// ============================== PRODUCTS ==============================
routes.get("/products/show/:id", productController.show);
routes.get("/products/create", productController.create);
routes.get("/products/update/:id", productController.update);

routes.post("/products", multer.array("photos", 4), productController.post);
routes.put("/products", multer.array("photos", 4), productController.put);
routes.delete("/products", productController.delete);

// =============================== OTHERS ================================
routes.get("/about", homeController.about);
routes.get("/exchangesAndReturn", homeController.exchange);
routes.get("/privacy", homeController.privacy);

export default routes;