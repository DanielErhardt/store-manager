const connection = require('./connection');

const getAll = async () => {
  const [products] = await connection
    .query('SELECT * FROM StoreManager.products;');
  return products;
};

module.exports = {
  getAll,
};
