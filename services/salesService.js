const salesModel = require('../models/salesModel');
const error = require('../utilities/expressError');

const getAll = async () => salesModel.getAll();

const getById = async (saleId) => {
  const saleResult = await salesModel.saleExists(saleId);
  if (!saleResult) throw error.saleNotFound;
  return salesModel.getById(saleId);
};

const add = async (saleProducts) => {
  const productsExist = await salesModel.saleProductsExist(saleProducts);
  if (!productsExist) throw error.productNotFound;
  return salesModel.add(saleProducts);
};

const edit = async (sale) => {
  const { saleId, products } = sale;

  const saleExists = await salesModel.saleExists(saleId);
  if (!saleExists) throw error.saleNotFound;
  
  const productsExist = await salesModel.saleProductsExist(products);
  if (!productsExist) throw error.productNotFound;

  return salesModel.edit(sale);
};

const remove = async (saleId) => {
  const saleExists = await salesModel.saleExists(saleId);
  if (!saleExists) throw error.saleNotFound;
  return salesModel.remove(saleId);
};

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
};
