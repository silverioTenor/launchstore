const express = require('express');
const routes = express.Router();

const homeController = require('./app/controllers/homeController');
const productController = require('./app/controllers/productController');

routes.get("/", productController.index);

routes.get("/about", homeController.about);
routes.get("/exchangesAndReturn", homeController.exchange);
routes.get("/privacy", homeController.privacy);

routes.get("/products/show/:id", productController.show);
routes.get("/products/create", productController.create);
routes.post("/products", productController.post);


module.exports = routes;