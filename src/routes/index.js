import { Router } from 'express';

const routes = Router();

import products from './products';
import session from './session';
import users from './users';
import cart from './cart';

routes.use('/products', products);
routes.use('/session', session);
routes.use('/users', users);
routes.use('/shopping-cart', cart);

// Alias
routes.get("/", (req, res) => res.redirect('/products'));

export default routes;