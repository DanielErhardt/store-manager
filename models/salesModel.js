const connection = require('./connection');

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
  add,
};