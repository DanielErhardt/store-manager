const productsModel = require('../models/productsModel');

const getAll = async () => productsModel.getAll();
const getById = async (id) => productsModel.getById(id);

module.exports = {
  getAll,
  getById,
};
