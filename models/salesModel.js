const connection = require('./connection');

const saleExists = async (saleId) => {
  const [[saleResult]] = await connection
    .execute('SELECT * FROM StoreManager.sales WHERE id = ?;', [saleId]);
  return saleResult !== undefined;
};

const getAll = async () => {
  const [sales] = await connection.execute('SELECT * FROM StoreManager.sales;');
  const [productSales] = await connection.execute('SELECT * FROM StoreManager.sales_products;');
  return productSales.map((productSale) => ({
    saleId: productSale.sale_id,
    date: sales.find((sale) => sale.id === productSale.sale_id).date,
    productId: productSale.product_id,
    quantity: productSale.quantity,
  }));
};

const getById = async (saleId) => {
  const [[sale]] = await connection
    .execute('SELECT * FROM StoreManager.sales WHERE id = ?;', [saleId]);
  
  const [productSales] = await connection
    .execute('SELECT * FROM StoreManager.sales_products WHERE sale_id = ?;', [saleId]);

  return productSales.map((productSale) => ({
    date: sale.date,
    productId: productSale.product_id,
    quantity: productSale.quantity,
  }));
};

const add = async (saleProducts) => {
  const [{ insertId: saleId }] = await connection
    .execute('INSERT INTO StoreManager.sales (date) VALUES (NOW())');

  const queries = saleProducts.map(({ productId, quantity }) => connection.execute(`
      INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?);
    `, [saleId, productId, quantity]));

  await Promise.all(queries);

  return {
    id: saleId,
    itemsSold: saleProducts,
  };
};

const edit = async (editedSale) => {
  const { saleId, products } = editedSale;  
  const queries = products.map(({ productId, quantity }) => (
    connection.execute(`
      UPDATE StoreManager.sales_products
      SET quantity = ?
      WHERE product_id = ?;
    `, [quantity, productId])
  ));
  
  await Promise.all(queries);
  
  return {
    saleId,
    itemsUpdated: products,
  };
};

const remove = async (id) => {
  await connection.execute(`
  DELETE FROM StoreManager.sales
  WHERE id = ?;
  `, [id]);
};

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
  saleExists,
};