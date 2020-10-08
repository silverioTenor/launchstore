const express = require('express');
const routes = express.Router();

const productController = require('./app/controllers/productController');

routes.get("/", productController.index);

module.exports = routes;