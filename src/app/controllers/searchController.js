import Product from '../models/Product';
import FilesManager from '../models/FilesManager';

import { formatPrice, formatProducts } from '../../lib/utils';

const SearchController = {
  async index(req, res) {
    try {
      let results, params = {};

      const { filter, brand } = req.query;

      if (!filter) res.redirect("/");

      params.filter = filter;

      if (brand) params.brand = brand;

      results = await Product.search(params);
      const data = results.rows;

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

      const products = await formatProducts(inf, 15);

      const search = {
        term: req.query.filter,
        total: products.length
      }

      const brands = products.map(product => ({
        id: product.id,
        name: product.brand
      })).reduce((brandsFiltered, brand) => {

        const found = brandsFiltered.some(filtered => filtered.name == brand.name);

        if (!found) brandsFiltered.push(brand);

        return brandsFiltered;
      }, []);

      return res.render("search/index", { products, search, brands });

    } catch (error) {
      console.error(error);
    }
  }
}

export default SearchController;