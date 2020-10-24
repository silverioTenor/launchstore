const Product = require('../models/Product');
const File = require('../models/File');
const fs = require('fs');

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

    if (req.files.length == 0) return res.json({ message: "Upload at least one image!" });

    let {
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
    const photos = [];

    for (const f in req.files) {
      photos[f] = req.files[f].path;
    }

    values = [photos, productID];
    await File.save(values);

    return res.redirect(`/products/show/${productID}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Product.get(id);
    const data = results.rows[0];

    results = await File.get(id);
    let files = results.rows[0].path;

    files = files.map(file => `${req.protocol}://${req.headers.host}${file}`.replace("public", ""));

    function formatPriceNow() {
      data.priceParcel = formatPrice(data.price / 12);

      data.off = formatPrice(data.price - (data.price * 5 / 100));

      data.price = formatPrice(data.price);

      data.condition = status(data.condition);
    }

    formatPriceNow();

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

    data.price = formatPrice(data.price);

    results = await File.get(id);
    let photos = results.rows[0].path;

    for (let i = 0; i < photos.length; i++) {
      photos[i] = {
        id: i,
        path: `${req.protocol}://${req.headers.host}${photos[i]}`.replace("public", "")
      }
    }

    const product = {
      id,
      ...data,
      photos
    }

    return res.render("products/update", { product });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (req.body[key] == "" && key != "removedPhotos") return res.json({ message: "Please! Fill all fields." });
    }

    let {
      id,
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

    if (req.body.removedPhotos) {
      let removedPhotos = req.body.removedPhotos.split(",");
      const lastIndex = removedPhotos.length - 1;

      removedPhotos.splice(lastIndex, 1);

      removedPhotos = removedPhotos.map(photo => Number(photo));

      // Remove old photos
      if (removedPhotos.length > 0) {
        const results = await File.get(id);
        let oldPhotos = results.rows[0].path;

        let filteredPhotos = [];

        for (let i = 0; i < removedPhotos.length; i++) {
          filteredPhotos[i] = oldPhotos[removedPhotos[i]];
        }

        filteredPhotos.forEach(photo => {
          if (fs.existsSync(photo)) {
            fs.unlinkSync(photo);
          }
        });

        removedPhotos.forEach(photo => {
          oldPhotos.splice(photo, 1);
        });

        if (req.files.length <= 0) {
          values = [id, oldPhotos];
          await File.edit(values);
        }
      }
    }

    // Saving files
    if (req.files.length > 0) {
      const photos = [];

      for (const f in req.files) {
        photos[f] = req.files[f].path;
      }

      values = [id, photos];
      await File.edit(values);
    }

    return res.redirect(`/products/show/${id}`);
  },
  async delete(req, res) {
    let { id } = req.body;
    id = Number(id);

    // Primeiro buscamos o path das imagens no DB para então sabermos quais excluir do diretório físico.
    const results = await File.get(id);
    let oldPhotos = results.rows[0].path;

    // Aqui, de fato excluímos as imagens do diretório.
    oldPhotos.forEach(photo => {
      if (fs.existsSync(photo)) {
        fs.unlinkSync(photo);
      }
    });

    // Aqui excluímos os registros referentes ao produto a em questão.
    await File.remove(id);

    // Por fim, excluímos o produto
    await Product.remove(id);

    return res.redirect("/");
  },
}