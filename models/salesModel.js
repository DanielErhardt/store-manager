const connection = require('./connection');

const saleProductsExist = async (saleProducts) => {
  const idList = saleProducts.map(({ productId }) => productId);
  const [[result]] = await connection
    .query('SELECT COUNT(*) FROM StoreManager.products WHERE id IN (?)', [idList]); 
  return result['COUNT(*)'] === idList.length;
};

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
  const [[{ date }]] = await connection
    .execute('SELECT * FROM StoreManager.sales WHERE id = ?;', [saleId]);
  
  const [productSales] = await connection
    .execute('SELECT * FROM StoreManager.sales_products WHERE sale_id = ?;', [saleId]);

  return productSales.map((productSale) => ({
    date,
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

const edit = async ({ saleId, products }) => {
  const sale = await getById(saleId);
  if (!sale) return null;

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
  await connection.query(`
    DELETE FROM StoreManager.sales_products
    WHERE sale_id = ?;
  `, [id]);

  await connection.query(`
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
  saleProductsExist,
  saleExists,
};