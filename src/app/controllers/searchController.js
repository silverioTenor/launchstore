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

    const products = await getProducts(inf, 11);
    const lastAdded = products.filter((product, index) => index > 3 ? false : true);
    
    return resolve.render("search/index", { products, lastAdded });
  }
}