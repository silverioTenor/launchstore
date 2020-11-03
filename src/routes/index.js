import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import home from './home';
import products from './products';
// import users from './users';

routes.use(home);
routes.use('/products', products);
// routes.use('/users', users);

export default routes;