const express = require('express');
const routes = express.Router();
const multer = require('./middlewares/multer');

const homeController = require('./app/controllers/homeController');
const productController = require('./app/controllers/productController');

routes.get("/", productController.index);

// ================================ HOME ================================
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

module.exports = routes;