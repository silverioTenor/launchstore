module.exports = {
  status(value) {
    if (value == "excelent") return "Excelente";
    else if (value == "very_good") return "Muito Bom";
    else if (value == "good") return "Bom";
  },
  formatPrice(price) {
    return new Intl.NumberFormat("pt-br", {
      style: 'currency', 
      currency: 'BRL'
    }).format(price / 100);
  },
  async getProducts(data, limit) {
    const { object, func } = data;
    const { getImage, formatPrice } = func;

    const productsPromise = object.map(async product => {
      product.image = await getImage(product.id);
      product.priceParcel = formatPrice(product.price / 12);
      product.price = formatPrice(product.price);

      return product;
    }).filter((product, index) => index > limit ? false : true);

    return await Promise.all(productsPromise);
  }
}