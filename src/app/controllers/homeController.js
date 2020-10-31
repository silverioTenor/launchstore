const Product = require('../models/Product');
const File = require('../models/File');

const { formatPrice, status } = require('../../lib/utils');

module.exports = {
  async index(req, res) {
    // Buscar todos os produtos
    let results = await Product.getAll();
    const data = results.rows;

    let files = [];
    let products = [];

    for (let i = 0; i < data.length; i++) {
      results = await File.get(data[i].id);
      files[i] = results.rows[0];

      if (data[i].id === files[i].product_id) {
        let image = files[i].path[0];

        image = `${req.protocol}://${req.headers.host}${image}`.replace("public", "");

        data[i].priceParcel = formatPrice(data[i].price / 12);
        data[i].price = formatPrice(data[i].price);
        products[i] = {
          ...data[i],
          image
        }
      }
    }

    return res.render("home/index", { products });
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