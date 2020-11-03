import Product from '../models/Product';
import FilesManager from '../models/FilesManager';

import utils from '../../lib/utils';

const { formatPrice, getProducts } = utils;

const SearchController = {
  async index(request, resolve) {
    try {
      let results, params = {};

      const { filter, brand } = request.query;

      if (!filter) resolve.redirect("/");

      params.filter = filter;

      if (brand) params.brand = brand;

      results = await Product.search(params);
      const data = results.rows;

      async function getImage(values) {
        results = await FilesManager.get(values);
        const files = results.rows.map(file => {
          return `${request.protocol}://${request.headers.host}${file.path[0]}`.replace("public", "");
        });

        return files[0];
      }

      const inf = {
        object: data,
        func: { getImage, formatPrice }
      };

      const products = await getProducts(inf, 15);

      const search = {
        term: request.query.filter,
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

      return resolve.render("search/index", { products, search, brands });

    } catch (error) {
      console.error(error);
    }
  }
}

export default SearchController;