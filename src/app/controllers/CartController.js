import Product from '../models/Product';

import { getImages } from '../services/fileService';
import Cart from '../../lib/Cart';

const CartController = {
  async index(req, res) {
    try {
      let { cart: oldCart } = req.session;

      if (oldCart?.items) {
        
        // get image
        for (const c in oldCart.items) {
          const productID = oldCart.items[c].product.id;
          const files = await getImages({ id: productID, column: "product_id" });
          oldCart.items[c].product.path = files[0].path;
        }
      }

      // format cart
      let cart = new Cart(oldCart);

      return res.render("cart/index", { cart });

    } catch (error) {
      console.log(`Unexpected error in INDEX CONTROLLERS: ${error}`);
    }
  },
  async addOne(req, res) {
    try {
      const { id } = req.params;

      const productDB = new Product();
      const product = await productDB.getBy({ where: { id } });

      let { cart: oldCart } = req.session;

      const cart = new Cart(oldCart);
      req.session.cart = cart.addOne(product);

      return res.redirect('/shopping-cart');

    } catch (error) {
      console.log(`Unexpected error in addOne CONTROLLERS: ${error}`);
    }
  },
  removeOne(req, res) {
    try {
      const { id } = req.params;

      let { cart: oldCart } = req.session;

      if (!oldCart) return res.redirect('/shopping-cart');

      const cart = new Cart(oldCart);
      req.session.cart = cart.removeOne(id);

      return res.redirect('/shopping-cart');

    } catch (error) {
      console.log(`Unexpected error in removeOne CONTROLLERS: ${error}`);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      let { cart: oldCart } = req.session;

      if (!oldCart) return res.redirect('/shopping-cart');

      const cart = new Cart(oldCart);
      req.session.cart = cart.delete(id);

      return res.redirect('/shopping-cart');

    } catch (error) {
      console.log(`Unexpected error in delete CONTROLLERS: ${error}`);
    }
  }
}

export default CartController;