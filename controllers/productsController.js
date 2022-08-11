const productsService = require('../services/productsService');
const STATUS = require('../utilities/httpStatus');

const getAll = async (_req, res) => {
  const products = await productsService.getAll();
  return res.status(STATUS.OK).json(products);
};

const getById = async (req, res) => {
  const { params: { id } } = req;
  const product = await productsService.getById(id);
  return product
    ? res.status(STATUS.OK).json(product)
    : res.status(STATUS.NOT_FOUND).json({ message: 'Product not found' });
};

const add = async (req, res) => {
  const { body: { name } } = req;
  const addedProduct = await productsService.add({ name });
  return res.status(STATUS.CREATED).json(addedProduct);
};

module.exports = { 
  getAll,
  getById,
  add,
};
