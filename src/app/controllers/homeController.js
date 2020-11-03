import Product from '../models/Product';
import FilesManager from '../models/FilesManager';

import utils from '../../lib/utils';

const { formatPrice, getProducts } = utils;

const HomeController = {
  async index(req, res) {
    let results = await Product.getAll();
    const data = results.rows;

    if (!data) return res.json({ message: "Data not found!" });

    async function getImage(values) {
      results = await FilesManager.get(values);
      const files = results.rows.map(file => {
        return `${req.protocol}://${req.headers.host}${file.path[0]}`.replace("public", "");
      });

      return files[0];
    }

    const inf = {
      object: data,
      func: { getImage, formatPrice }
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