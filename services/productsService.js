const productsModel = require('../models/productsModel');

const getAll = async () => productsModel.getAll();
const getById = async (id) => productsModel.getById(id);
const add = async (product) => productsModel.add(product);
const edit = async (product) => productsModel.edit(product);

module.exports = {
  getAll,
  getById,
  add,
  edit,
};
