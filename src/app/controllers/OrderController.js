import mailer from '../../lib/mailer'

import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';

import Cart from '../../lib/Cart';
import { getImages } from '../services/procedures';
import { formatPrice, formatDate } from '../../lib/utils';

function mailHTML(seller, product, buyer, item) {
  return {
    to: seller.email,
    from: "no-replay@gmail.com",
    subject: "Novo pedido de compra",
    html: `
      <h2>Olá, ${seller.name}!</h2>
      <p>Você tem um novo pedido de compra para o seguinte produto:</p>
      <p>Produto: ${product.brand} ${product.model} ${product.color}</p>
      <p>Preço unitário: ${formatPrice(product.price)}</p>
      <p>Quantidade: ${item.quantity}</p>
      <p>Preço total: ${item.formattedPrice}</p>
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
  async index(req, res) {
    try {
      const { userID } = req.session.user;

      const orderDB = new Order();
      let orders = await orderDB.get({ id: userID, column: "buyer_id" });

      const statusOrder = {
        open: "Aberto",
        sold: "Vendido",
        canceled: "Cancelado"
      }

      orders = orders.map(async order => {
        const productDB = new Product();
        const product = await productDB.getBy({ where: { id: order.product_id } });
        order.productName = `${product.brand} ${product.model} ${product.status} ${product.color}`;

        const files = await getImages({ id: order.product_id, column: "product_id" });
        order.productPath = files[0].path;

        order.formattedPrice = formatPrice(order.price);
        order.formattedTotalPrice = formatPrice(order.total);
        order.statusCurrent = statusOrder[order.status];
        order.updatedAt = formatDate(order.updated_at).long;

        return order;
      });

      orders = await Promise.all(orders);

      return res.render("orders/purchases", { orders });

    } catch (error) {
      console.log(`Unexpected error in INDEX CONTROLLER: ${error}`);
    }
  },
  async sales(req, res) { },
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

        await mailer.sendMail(mailHTML(seller, product, buyer, item));

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