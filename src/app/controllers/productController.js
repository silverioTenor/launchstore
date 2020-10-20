const Product = require('../models/Product');
const File = require('../models/File');

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
      description
    } = req.body;

    const created_at = new Date(Date.now());

    let values = [
      color,
      brand,
      model,
      status,
      description,
      price,
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
  show(req, res) {
    return res.render("products/show");
  },
  update(req, res) { },
  put(req, res) { },
  delete(req, res) { },
}