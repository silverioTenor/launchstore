import Product from '../models/Product';
import { formatPrice, formatProducts } from '../../lib/utils';

const HomeController = {
  async index(req, res) {
    try {
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

      const products = await formatProducts(inf, 11);
      const lastAdded = products.filter((product, index) => index > 3 ? false : true).reverse();

      return res.render("home/index", { products, lastAdded });
      
    } catch (error) {
      console.log(`Unexpected error in HOME: ${error}`);
    }
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