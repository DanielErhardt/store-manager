const error = require('../utilities/expressError');

const productsModel = require('../models/productsModel');

const getAll = async () => productsModel.getAll();

const getById = async (productId) => {
  const productExists = await productsModel.productExists(productId);
  if (!productExists) throw error.productNotFound;
  return productsModel.getById(productId);
};

const add = async (product) => productsModel.add(product);

const edit = async (product) => {
  const { id } = product;
  const productExists = await productsModel.productExists(id);
  if (!productExists) throw error.productNotFound;
  return productsModel.edit(product);
};

const remove = async (productId) => {
  const productExists = await productsModel.productExists(productId);
  if (!productExists) throw error.productNotFound;
  return productsModel.remove(productId);
};

const getByName = async (productName) => {
  const products = await productsModel.getByName(productName);
  if (!products.length) throw error.productNotFound;
  return products;
};

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
  getByName,
};
