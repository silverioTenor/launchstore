import { Router } from 'express';
const routes = Router();

import HomeController from '../app/controllers/HomeController';

routes.get("/", HomeController.index);
// routes.get("/about", HomeController.about);
// routes.get("/exchangesAndReturn", HomeController.exchange);
// routes.get("/privacy", HomeController.privacy);

export default routes;