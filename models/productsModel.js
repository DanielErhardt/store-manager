const connection = require('./connection');

const getAll = async () => {
  const [products] = await connection
    .query('SELECT * FROM StoreManager.products;');
  return products;
};

const getById = async (id) => {
  const [product] = await connection
    .query('SELECT * FROM StoreManager.products WHERE id = ?;', [id]);
  return product[0];
};

const add = async ({ name }) => {
  const [result] = await connection.query(`
    INSERT INTO StoreManager.products (name) VALUES (?);
  `, [name]);
  return { id: result.insertId, name };
};

const edit = async ({ id, name }) => {
  await connection.query(`
  UPDATE StoreManager.products
  SET name = ?
  WHERE id = ?;
  `, [name, id]);
  
  return { id, name };
};

const remove = async (id) => {
  await connection.query(`
  DELETE FROM StoreManager.products
  WHERE id = ?;
  `, [id]);
};

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
};
