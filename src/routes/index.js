import { Router } from 'express';

const routes = Router();

import products from './products.js';
import session from './session.js';
import users from './users.js';
import cart from './cart.js';
import order from './orders.js';

routes.use('/products', products);
routes.use('/session', session);
routes.use('/users', users);
routes.use('/shopping-cart', cart);
routes.use('/orders', order);

// Alias
routes.get("/", (req, res) => res.redirect('/products'));

export default routes;