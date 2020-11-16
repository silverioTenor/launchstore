import Product from '../models/Product';
import FilesManager from '../models/FilesManager';

import fs from 'fs';
import utils from '../../lib/utils';

const { formatPrice, status } = utils;

const ProductController = {
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
      color,
      model,
      condition,
      price,
      old_price,
      storage,
      description
    } = req.body;

    const userID = req.session.user.userID;
    price = price.replace(/\D/g, "");

    let values = [
      userID,
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
    const productID = await Product.save(values);

    // Saving files
    const photos = [];

    for (const f of req.files) {
      photos.push(f.path);
    }

    const column = "product_id";
    values = { id: productID, column };

    const fileID = await FilesManager.save(values);

    values = [photos, fileID];
    await FilesManager.saveInFiles(values);

    return res.redirect(`/products/show/${productID}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Product.get(id);
    const data = results.rows[0];

    const column = "product_id";
    const values = { id, column };

    results = await FilesManager.get(values);
    let files = results.path;

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

    const column = "product_id";
    const values = { id, column };

    async function getImage(values) {
      results = await FilesManager.get(values);
      let count = 0;

      const files = results.path.map(file => {
        const photo = {
          id: count,
          path: `${req.protocol}://${req.headers.host}${file}`.replace("public", "")
        }
        count++

        return photo;
      });

      return files;
    }

    const photos = await getImage(values);

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

    let fm_id = 0;

    if (req.body.removedPhotos) {
      let removedPhotos = req.body.removedPhotos.split(",");
      const lastIndex = removedPhotos.length - 1;

      removedPhotos.splice(lastIndex, 1);

      removedPhotos = removedPhotos.map(photo => Number(photo));

      // Remove old photos
      if (removedPhotos.length > 0) {
        const column = "product_id";
        let values = { id, column };

        const results = await FilesManager.get(values);
        fm_id = results.rows[0].id;
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

        values = [fm_id, oldPhotos];
        await FilesManager.edit(values);
      }
    }

    // Saving files
    if (req.files.length > 0) {
      const photos = [];

      for (const f in req.files) {
        photos[f] = req.files[f].path;
      }

      values = [fm_id, photos];
      await FilesManager.edit(values);
    }

    return res.redirect(`/products/show/${id}`);
  },
  async delete(req, res) {
    let { id } = req.body;
    id = Number(id);

    // Primeiro buscamos o path das imagens no DB para então sabermos quais excluir do diretório físico.
    const column = "product_id";
    const values = { id, column };

    const results = await FilesManager.get(values);
    const fm_id = results.rows[0].id;
    let oldPhotos = results.rows[0].path;

    // Aqui, de fato excluímos as imagens do diretório.
    oldPhotos.forEach(photo => {
      if (fs.existsSync(photo)) {
        fs.unlinkSync(photo);
      }
    });

    // Aqui excluímos os registros referentes ao produto a em questão.
    await FilesManager.removeInFiles(fm_id);
    await FilesManager.remove(values);

    // Por fim, excluímos o produto
    await Product.remove(id);

    return res.redirect("/");
  },
}

export default ProductController;