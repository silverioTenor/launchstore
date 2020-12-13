import { formatPrice } from './utils';

export default class Cart {

  constructor(oldCart) {
    if (oldCart) {
      this.items = oldCart.items;
      this.total = oldCart.total;

    } else {
      this.items = [];
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }
    }

    return this;
  }

  addOne(product) {
    // Exist product
    let inCart = this.items.find(item => item.product.id == product.id);

    // if not exist product. Then create one
    if (!inCart) {
      inCart = {
        product: {
          ...product,
          formattedPrice: formatPrice(product.price)
        },
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }

      // Add new item
      this.items.push(inCart);
    }

    // if quantity product exceed max limit of product. Then return
    if (inCart.quantity >= product.quantity) return this;

    // update item
    inCart.quantity++;
    inCart.price = inCart.product.price * inCart.quantity;
    inCart.formattedPrice = formatPrice(inCart.price);

    // update cart
    this.total.quantity++;
    this.total.price += inCart.product.price;
    this.total.formattedPrice = formatPrice(this.total.price);

    return this;
  }

  removeOne(productID) {
    // get item of cart
    const inCart = this.items.find(item => item.product.id == productID);

    if (!inCart) return this;

    // update item
    inCart.quantity--;
    inCart.price = inCart.product.price * inCart.quantity;
    inCart.formattedPrice = formatPrice(inCart.price);

    // update cart
    this.total.quantity--;
    this.total.price -= inCart.product.price;
    this.total.formattedPrice = formatPrice(this.total.price);

    // verify whether quantity in the cart is 0
    if (inCart.quantity <= 0) {
      const itemIndex = this.items.indexOf(inCart);
      this.items.splice(itemIndex, 1);

      return this;
    }

    return this;
  }

  delete(productID) {
    const inCart = this.items.find(item => item.product.id == productID);

    if (!inCart) return this;

    if (this.items.length > 0) {
      this.total.quantity -= inCart.quantity;
      this.total.price -= (inCart.product.price * inCart.quantity);
      this.total.formattedPrice = formatPrice(this.total.price);
    }

    this.items = this.items.filter(item => inCart.product.id != item.product.id);

    return this;
  }
}