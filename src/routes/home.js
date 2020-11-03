import { Router } from 'express';
const routes = Router();

import HomeController from '../app/controllers/HomeController';
import SearchController from '../app/controllers/SearchController';

routes.get("/", HomeController.index);
routes.get("/about", HomeController.about);
routes.get("/exchangesAndReturn", HomeController.exchange);
routes.get("/privacy", HomeController.privacy);

routes.get("/products/search", SearchController.index);

export default routes;