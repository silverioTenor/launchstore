import { getImages } from '../app/services/procedures';

export function status(value) {
  if (value == "excelent") return "Excelente";
  else if (value == "very_good") return "Muito Bom";
  else if (value == "good") return "Bom";
}

export function formatPrice(price) {
  return new Intl.NumberFormat("pt-br", {
    style: 'currency',
    currency: 'BRL'
  }).format(price / 100);
}

export function formatCpfCnpj(value) {
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
}

export function formatCep(value) {
  value = value.replace(/\D/g, "");

  if (value.length > 8) {
    value = value.slice(0, -1);
  }

  if (value.length < 9) {
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return value;
}

export async function formatProducts(data) {
  try {
    const { object } = data;

    const productsPromise = object.map(async product => {
      const values = { id: product.id, column: "product_id" };

      const images = await getImages(values);

      product.image = images[0].path;
      product.priceParcel = formatPrice(product.price / 12);
      product.price = formatPrice(product.price);
      product.old_price = formatPrice(product.old_price);

      return product;
      
    });

    return await Promise.all(productsPromise);

  } catch (error) {
    console.log(`Unexpected error in formatProducts: ${error}`);
  }
}

export function formatDate(dateTime) {
  dateTime = Date.parse(dateTime);
  const data = new Date(dateTime);
  
  const date = data.getDate();
  const month = data.getMonth();
  const year = data.getFullYear();
  const seconds = data.getSeconds();
  const minuts = data.getMinutes();
  const hours = data.getHours();

  const monthExtensive = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];

  return {
    iso: `${year}-${month}-${date}:${hours}:${minuts}:${seconds}`,
    ptBR: `${date}/${month}/${year}`,
    long: `${date} de ${monthExtensive[month]} de ${year}`
  };
}