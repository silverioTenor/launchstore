import fs from 'fs';

import Product from '../models/Product';
import File from './../models/File';
import FilesManager from '../models/FilesManager';

import { getImages } from '../services/procedures';
import { formatPrice, status } from '../../lib/utils';

const ProductController = {
  create(req, res) {
    return res.render("products/create");
  },
  async post(req, res) {
    try {
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

      let values = {
        user_id: userID,
        color,
        brand,
        model,
        condition,
        description,
        price,
        old_price: old_price || price,
        storage
      };

      // Saving product
      const productDB = new Product();
      const productID = await productDB.create(values);

      // Saving files
      const photos = req.files.map(file => file.path);

      const fmDB = new FilesManager();
      const fmID = await fmDB.create({ product_id: productID });

      values = [photos, fmID];

      const fileDB = new File();
      await fileDB.create(values);

      return res.redirect(`/products/show/${productID}?status=200`);

    } catch (error) {
      console.log(`Unexpected error in POST PRODUCT: ${error}`);
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params;

      const productDB = new Product();
      const data = await productDB.getBy({ where: { id } });

      const values = { id, column: "product_id" };
      let files = "";

      files = await getImages(values);

      files = files.map(file => `${file.path}`.replace("public", ""));


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

      if (req.query.status == 200) {
        return res.render("products/show", {
          product,
          message: "Operação feita com sucesso!",
          type: "success"
        });
      } else {
        return res.render("products/show", { product });
      }

    } catch (error) {
      console.error(`Unexpected error: ${error}`);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;

      const productDB = new Product();
      const data = await productDB.getBy({ where: { id } });

      data.price = formatPrice(data.price);

      const values = { id, column: "product_id" };
      let photos = "";

      try {
        photos = await getImages(values);
      } catch (error) {
        console.error(`Unexpected error: ${error}`);
      }

      const product = {
        ...data,
        photos
      }

      if (req.query.status == 200) {
        return res.render("products/update", {
          product,
          message: "Operação feita com sucesso!",
          type: "success"
        });
      } else if (req.query.status == 400) {
        return res.render("products/update", {
          product,
          message: "Não foi possível completar a operação. Tente novamente.",
          type: "error"
        });
      } else {
        return res.render("products/update", { product });
      }

    } catch (error) {
      console.error(`Failed in Update. error: ${error}`);

      return res.render("products/update", {
        message: "Sistema indisponível no momento.",
        type: "error",
        formFull: true
      });
    }
  },
  async put(req, res) {
    try {
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
      id = Number(id)
      let values = { id, column: "id" };

      const fields = {
        color,
        brand,
        model,
        condition,
        description,
        price: Number(price),
        old_price: Number(old_price),
        storage
      };

      const productDB = new Product();
      await productDB.update(values, fields);

      const fileDB = new File();
      await fileDB.update(req.updatedFiles);

      return res.redirect(`/products/update/${id}?status=200`);

    } catch (error) {
      console.error(`Failed to Update. error: ${error}`);

      return res.redirect(`/products/update/${req.body.id}?status=400`);
    }
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