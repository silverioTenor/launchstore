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
        const avatar_url = files[i].path[0];

        data[i].priceParcel = formatPrice(data[i].price / 12);
        data[i].price = formatPrice(data[i].price);
        products[i] = {
          ...data[i],
          avatar_url
        }
      }
    }

    return res.render("products/index", { products });
  },
  create(req, res) {
    return res.render("products/create");
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (req.body[key] == "") return res.json({ message: "Please! Fill all fields." });
    }

    let {
      photos,
      brand,
      model,
      color,
      condition,
      price,
      old_price,
      storage,
      description
    } = req.body;

    price = price.replace(/\D/g, "");

    let values = [
      color,
      brand,
      model,
      condition,
      description,
      price,
      old_price || price,
      storage
    ];

    // Saving product
    let results = await Product.save(values);
    const productID = results.rows[0].id;

    // Saving files
    values = [photos, productID];

    results = await File.save(values);

    return res.redirect(`/products/show/${productID}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Product.get(id);
    const data = results.rows[0];

    results = await File.get(id);
    let files = results.rows[0].path;

    data.priceParcel = formatPrice(data.price / 12);

    data.off = formatPrice(data.price - (data.price * 5 / 100));

    data.price = formatPrice(data.price);

    data.condition = status(data.condition);

    const product = {
      ...data,
      files
    };

    return res.render("products/show", { product });
  },
  async update(req, res) {
    const { id } = req.params;

    let results = await Product.get(id);
    const data = results.rows[0];

    results = await File.get(id);
    const avatar_url = results.rows[0].path;

    data.price = formatPrice(data.price);

    const product = {
      id,
      ...data,
      avatar_url
    }

    return res.render("products/update", { product });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (req.body[key] == "") return res.json({ message: "Please! Fill all fields." });
    }

    let {
      id,
      photos,
      brand,
      model,
      color,
      condition,
      price,
      old_price,
      storage,
      description
    } = req.body;

    price = price.replace(/\D/g, "");

    if (old_price != price) {
      const results = await Product.get(id);
      old_price = results.rows[0].price;
    }

    let values = [
      id = Number(id),
      color,
      brand,
      model,
      condition,
      description,
      price = Number(price),
      old_price = Number(old_price),
      storage
    ];

    // Saving product
    await Product.edit(values);

    // Saving files
    values = [id, photos];
    await File.edit(values);

    return res.redirect(`/products/show/${id}`);
  },
  async delete(req, res) {
    let { id } = req.body;
    id = Number(id);

    await File.remove(id);
    await Product.remove(id);

    return res.redirect("/");
  },
}