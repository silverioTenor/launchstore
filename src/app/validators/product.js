import Product from '../models/Product';

const ProductValidator = {
  checkAllFields(body) {
    const keys = Object.keys(body);

    for (const key of keys) {
      if (body[key] == "") return body[key];
    }
  },
  post(req, res, next) {
    const check = ProductValidator.checkAllFields(req.body);
    if (check) return check;

    // try {

    // } catch (error) {
    //   console.error(`Unexpected error in POST VALIDATORS: ${error}`);
    // }

    next();
  },
  async put(req, res, next) {
    const check = ProductValidator.checkAllFields(req.body);

    if (check) return res.render("products/update", {
      product: req.body,
      message: `Por favor, preencha o campo ${check}.`,
      type: "error"
    })

    if (req.body.old_price != req.body.price) {
      const productDB = new Product();
      const data = await productDB.getBy({ where: { id: req.body.id } });
      req.body.old_price = data.price;
    }

    next();
  }
}

export default ProductValidator;