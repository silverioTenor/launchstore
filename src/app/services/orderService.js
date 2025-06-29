import Order from '../models/Order.js';
import Product from './../models/Product.js';

import { getImages } from './fileService.js';
import { formatOrderStatus, formatDate, formatPrice } from '../../lib/utils.js';

export async function getOrders(user) {
  try {
    const orderDB = new Order();
    let orders = await orderDB.get(user);

    orders = orders.map(async order => {
      const productDB = new Product();
      const product = await productDB.getByProductsWithDeleted({ where: { id: order.product_id } });
      order.productName = `${product.brand} ${product.model} ${product.status} ${product.color}`;

      const files = await getImages({ id: order.product_id, column: "product_id" });
      order.productPath = files[0].path;

      order.formattedPrice = formatPrice(order.price);
      order.formattedTotalPrice = formatPrice(order.total);
      order.statusCurrent = formatOrderStatus(order.status);
      order.updatedAt = formatDate(order.updated_at).longDateTime;

      return order;
    });

    orders = await Promise.all(orders);

    return orders;

  } catch (error) {
    console.log(`Unexpected error in GET ORDER SERVICE: ${error}`);
  }
}