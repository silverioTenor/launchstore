import Product from '../models/Product';
import { formatProducts } from '../../lib/utils';

const SearchController = {
  async index(req, res) {
    try {
      let params = {};

      const { filter, brand } = req.query;

      if (filter) params.filter = filter;

      if (brand) params.brand = brand;

      const data = await Product.search(params);

      const products = await formatProducts({ object: data }, 15);

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