const productsModel = require('../models/productsModel');

const getAll = async () => productsModel.getAll();
const getById = async (id) => productsModel.getById(id);
const add = async (product) => productsModel.add(product);

module.exports = {
  getAll,
  getById,
  add,
};
