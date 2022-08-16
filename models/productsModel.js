const connection = require('./connection');

const productExists = async (id) => {
  const [[product]] = await connection
    .execute('SELECT * FROM StoreManager.products WHERE id = ?;', [id]);
  return product !== undefined;
};

const allProductsExist = async (idList) => {
  const [[result]] = await connection
    .query('SELECT COUNT(*) FROM StoreManager.products WHERE id IN (?);', [idList]); 
  return result['COUNT(*)'] === idList.length;
};

const getAll = async () => {
  const [products] = await connection
    .execute('SELECT * FROM StoreManager.products;');
  return products;
};

const getById = async (id) => {
  const [[product]] = await connection
    .execute('SELECT * FROM StoreManager.products WHERE id = ?;', [id]);
  return product;
};

const add = async ({ name }) => {
  const [result] = await connection.execute(`
    INSERT INTO StoreManager.products (name) VALUES (?);
  `, [name]);
  return { id: result.insertId, name };
};

const edit = async ({ id, name }) => {
  await connection.execute(`
  UPDATE StoreManager.products
  SET name = ?
  WHERE id = ?;
  `, [name, id]);
  
  return { id, name };
};

const remove = async (id) => {
  await connection.execute(`
  DELETE FROM StoreManager.products
  WHERE id = ?;
  `, [id]);
};

const getByName = async (name) => {
  const [products] = await connection
    .execute('SELECT * FROM StoreManager.products WHERE name LIKE ?;', [`%${name}%`]);
  
  return products;
};

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
  getByName,
  productExists,
  allProductsExist,
};
