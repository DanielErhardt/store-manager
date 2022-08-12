const productsModel = require('../models/productsModel');

const getAll = async () => productsModel.getAll();
const getById = async (id) => productsModel.getById(id);
const add = async (product) => productsModel.add(product);
const edit = async (product) => productsModel.edit(product);
const remove = async (id) => productsModel.remove(id);
const getByName = async (name) => productsModel.getByName(name);

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
  getByName,
};
