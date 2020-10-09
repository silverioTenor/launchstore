const express = require('express');
const routes = express.Router();

const homeController = require('./app/controllers/homeController');
const productController = require('./app/controllers/productController');

routes.get("/", productController.index);

routes.get("/about", homeController.about);


module.exports = routes;