const express = require('express');
const routes = express.Router();

const homeController = require('./app/controllers/homeController');
const productController = require('./app/controllers/productController');

routes.get("/", (req, res) => res.redirect("/products"));
routes.get("/products", productController.index);
routes.get("/products/show", productController.show);

routes.get("/about", homeController.about);
routes.get("/exchangesAndReturn", homeController.exchange);
routes.get("/privacy", homeController.privacy);


module.exports = routes;