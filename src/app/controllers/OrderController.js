import mailer from '../../lib/mailer'

import User from '../models/User';
import Product from '../models/Product';

import { formatPrice } from '../../lib/utils';

function mailHTML(seller, product, buyer) {
  return {
    to: seller.email,
    from: "no-replay@gmail.com",
    subject: "Novo pedido de compra",
    html: `
      <h2>Olá, ${seller.name}!</h2>
      <p>Você tem um novo pedido de compra para o seguinte produto:</p>
      <p>Produto: ${product.brand} ${product.model} ${product.color}</p>
      <p>Preço: ${formatPrice(product.price)}</p>
      <br>
      <h4>Dados do comprador</h4>
      <p>Nome: ${buyer.name}</p>
      <p>E-mail: ${buyer.email}</p>
      <br>
      <strong>Entre em contato com o comprador, para finalizar a venda!</strong>
      <br><br>
      <p>Atenciosamente,</p>
      <p>Equipe Launchstore</p>
    `
  }
}

const OrderController = {
  async post(req, res) {
    try {
      const { id } = req.body;
      const { userID } = req.session.user;

      const productDB = new Product();
      const product = await productDB.getBy({ where: { id } });

      if (product.user_id == userID) return res.render("products/show", {
        message: "Você não pode comprar seu próprio produto",
        type: "errror"
      });

      const userDB = new User();
      const seller = await userDB.getBy({ where: { id: product.user_id } });

      const buyer = await userDB.getBy({ where: { id: userID } });

      mailer.sendMail(mailHTML(seller, product, buyer));

      return res.redirect('/shopping-cart/order-success');

    } catch (error) {
      console.log(`Unexpected error in POST CONTROLLERS: ${error}`);

      return res.redirect('/shopping-cart/order-failed');
    }
  },
  success(req, res) {
    return res.render("orders/order-success");
  },
  failed(req, res) {
    return res.render("orders/order-failed");
  }
}

export default OrderController;