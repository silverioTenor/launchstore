import Product from '../models/Product';

import factory from '../services/factory'
import utils from '../../lib/utils';
const { formatPrice, getProducts } = utils;

const HomeController = {
  async index(req, res) {
    const productDB = new Product();
    const data = await productDB.getAll();

    if (!data) return res.render("home/index", {
      message: "Sistema indisponível no momento! Volte mais tarde.",
      type: "error"
    });

    const inf = {
      object: data,
      func: { formatPrice }
    };

    const products = await getProducts(inf, 11);
    const lastAdded = products.filter((product, index) => index > 3 ? false : true);

    return res.render("home/index", { products, lastAdded });
  },
  about(req, res) {
    return res.render("home/about");
  },
  exchange(req, res) {
    return res.render("home/exchangeAndReturn");
  },
  privacy(req, res) {
    return res.render("home/privacy");
  }
}

export default HomeController;