import { Router } from 'express';

const routes = Router();

import home from './home';
import products from './products';
import session from './session';
import users from './users';
import cart from './cart';

routes.use(home);
routes.use('/products', products);
routes.use('/session', session);
routes.use('/users', users);
routes.use('/shopping-cart', cart);

export default routes;