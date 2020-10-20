const Product = require('../models/Product');
const File = require('../models/File');

const { status } = require('../../lib/utils');

module.exports = {
  index(req, res) {
    return res.render("products/index");
  },
  create(req, res) {
    return res.render("products/create");
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (req.body[key] == "") return res.json({ message: "Please! Fill all fields." });
    }

    const {
      avatar_url,
      brand,
      model,
      color,
      status,
      price,
      old_price,
      storage,
      description
    } = req.body;

    price = price.replace(/\D/g, "");
    const created_at = new Date(Date.now());

    let values = [
      color,
      brand,
      model,
      status,
      description,
      price,
      old_price || price,
      storage,
      created_at
    ];

    // Saving product
    let results = await Product.save(values);
    const productID = results.rows[0].id;

    // Saving files
    values = [avatar_url, productID];

    results = await File.save(values);

    return res.redirect(`/products/show/${productID}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Product.get(id);
    const data = results.rows[0];

    results = await File.get(id);
    let files = results.rows;

    data.priceParcel = new Intl.NumberFormat("pt-br", {
      style: 'currency',
      currency: 'BRL'
    }).format(data.price / 12);

    data.off = new Intl.NumberFormat("pt-br", {
      style: 'currency',
      currency: 'BRL'
    }).format(data.price - (data.price * 5 / 100));

    data.price = new Intl.NumberFormat("pt-br", {
      style: 'currency',
      currency: 'BRL'
    }).format(data.price);

    data.status = status(data.status);

    const product = {
      ...data,
      files
    };

    return res.render("products/show", { product });
  },
  update(req, res) { },
  put(req, res) { },
  delete(req, res) { },
}