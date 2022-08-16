const productsService = require('../services/productsService');
const httpStatus = require('../utilities/httpStatus');

const getAll = async (_req, res) => {
  const products = await productsService.getAll();
  return res.status(httpStatus.OK).json(products);
};

const getById = async (req, res) => {
  const { params: { id } } = req;
  const product = await productsService.getById(id);
  return res.status(httpStatus.OK).json(product);
};

const add = async (req, res) => {
  const { body: { name } } = req;
  const addedProduct = await productsService.add({ name });
  return res.status(httpStatus.CREATED).json(addedProduct);
};

const edit = async (req, res) => {
  const { params: { id }, body: { name } } = req;
  const editedProduct = await productsService.edit({ id, name });
  return res.status(httpStatus.OK).json(editedProduct);
};

const remove = async (req, res) => {
  const { params: { id } } = req;  
  await productsService.remove(id);
  return res.status(httpStatus.NO_CONTENT).send();
};

const getByName = async (req, res) => {
  const { query: { q } } = req;
  const products = await productsService.getByName(q);
  return res.status(httpStatus.OK).json(products);
};

module.exports = { 
  getAll,
  getById,
  add,
  edit,
  remove,
  getByName,
};
