const utils = {
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
  formatCpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 14) {
      value = value.slice(0, -1);
    }

    if (value.length < 12) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1-$2");

    } else {
      value = value.replace(/(\d{2})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return value;
  },
  formatCep(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, -1);
    }

    if (value.length < 9) {
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return value;
  },
  async getProducts(data, limit) {
    const { object, func } = data;
    const { getImage, formatPrice } = func;

    const column = "product_id";
    
    const productsPromise = object.map(async product => {
      const values = { id: product.id, column };

      product.image = await getImage(values);
      product.priceParcel = formatPrice(product.price / 12);
      product.price = formatPrice(product.price);

      return product;
    }).filter((product, index) => index > limit ? false : true);

    return await Promise.all(productsPromise);
  }
}

export default utils;