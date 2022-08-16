const productsService = require('../services/productsService');
const httpStatus = require('../utilities/httpStatus');

const productNotFoundResponse = (res) => res
  .status(httpStatus.NOT_FOUND).json({ message: 'Product not found' });

const getAll = async (_req, res) => {
  const products = await productsService.getAll();
  return res.status(httpStatus.OK).json(products);
};

const getById = async (req, res) => {
  const { params: { id } } = req;
  const product = await productsService.getById(id);
  return product
    ? res.status(httpStatus.OK).json(product)
    : productNotFoundResponse(res);
};

const add = async (req, res) => {
  const { body: { name } } = req;
  const addedProduct = await productsService.add({ name });
  return res.status(httpStatus.CREATED).json(addedProduct);
};

const edit = async (req, res) => {
  const { params: { id }, body: { name } } = req;
  const product = await productsService.getById(id);
  if (!product) return productNotFoundResponse(res);

  const editedProduct = await productsService.edit({ id, name });
  return res.status(httpStatus.OK).json(editedProduct);
};

const remove = async (req, res) => {
  const { params: { id } } = req;
  const product = await productsService.getById(id);
  if (!product) return productNotFoundResponse(res);
  
  await productsService.remove(id);

  res.status(httpStatus.NO_CONTENT).send();
};

const getByName = async (req, res) => {
  const { query: { q } } = req;
  const products = await productsService.getByName(q);
  return products
    ? res.status(httpStatus.OK).json(products)
    : productNotFoundResponse(res);
};

module.exports = { 
  getAll,
  getById,
  add,
  edit,
  remove,
  getByName,
};
