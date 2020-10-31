import Product from '../models/Product';
import File from '../models/File';

import { formatPrice, getProducts } from '../../lib/utils';

module.exports = {
  async index(request, resolve) {
    // Buscar todos os produtos
    let results = await Product.getAll();
    const data = results.rows;

    if (!data) return resolve.json({ message: "Data not found!" });

    async function getImage(productID) {
      results = await File.get(productID);
      const files = results.rows.map(file => {
        return `${request.protocol}://${request.headers.host}${file.path[0]}`.replace("public", "");
      });

      return files[0];
    }

    const inf = {
      object: data,
      func: { getImage, formatPrice }
    };

    const lastAdded = await getProducts(inf, 3);
    const products = await getProducts(inf, 11);

    return resolve.render("home/index", { products, lastAdded });
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