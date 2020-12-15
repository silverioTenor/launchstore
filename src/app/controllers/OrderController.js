import mailer from '../../lib/mailer'

import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';

import Cart from '../../lib/Cart';
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
      // get products from the cart
      const cart = new Cart(req.session.cart);

      const buyer_id = req.session.user.userID;
      const filteredItems = cart.items.filter(item => item.product.user_id != buyer_id);

      async function getUser(user) {
        const userDB = new User();
        const data = await userDB.getBy({ where: { id: user } });

        return data;
      }

      // Order create
      const createOrdersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item;
        const { price, id: product_id, user_id: seller_id } = product;

        const status = "open";
        const fields = {
          seller_id,
          buyer_id,
          product_id,
          price,
          total,
          quantity,
          status
        }

        const orderDB = new Order();
        const order = await orderDB.create(fields);
        
        // get product
        const productDB = new Product();
        product = await productDB.getBy({ where: { id: product_id } });
        
        // get seller and buyer
        const seller = await getUser(seller_id);
        const buyer = await getUser(buyer_id);
        
        await mailer.sendMail(mailHTML(seller, product, buyer));

        return order;
      });

      await Promise.all(createOrdersPromise);

      delete req.session.cart;

      return res.redirect('/orders/order-success');

    } catch (error) {
      console.log(`Unexpected error in POST CONTROLLERS: ${error}`);

      return res.redirect('/orders/order-failed');
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