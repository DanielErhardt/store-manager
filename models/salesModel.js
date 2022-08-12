const connection = require('./connection');

const getAll = async () => {
  const [sales] = await connection.query('SELECT * FROM StoreManager.sales;');
  const [productSales] = await connection.query('SELECT * FROM StoreManager.sales_products;');

  return productSales.map((prodSale) => ({
    saleId: prodSale.sale_id,
    date: sales.find((sale) => sale.id === prodSale.sale_id).date,
    productId: prodSale.product_id,
    quantity: prodSale.quantity,
  }));
};

const getById = async (id) => {
  const [[sale]] = await connection
    .query('SELECT * FROM StoreManager.sales WHERE id = ?;', [id]);
  
  if (!sale) return null;
  
  const [productSales] = await connection
    .query('SELECT * FROM StoreManager.sales_products WHERE sale_id = ?;', [id]);

  return productSales.map((productSale) => ({
    date: sale.date,
    productId: productSale.product_id,
    quantity: productSale.quantity,
  }));
};

const add = async (sales) => {
  const [{ insertId: saleId }] = await connection
    .query('INSERT INTO StoreManager.sales (date) VALUES (NOW())');

  sales.forEach(async (sale) => {
    const { productId, quantity } = sale;
    await connection.query(`
      INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?);
    `, [saleId, productId, quantity]);
  });

  return {
    id: saleId,
    itemsSold: sales,
  };
};

module.exports = {
  getAll,
  getById,
  add,
};