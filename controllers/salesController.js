const salesService = require('../services/salesService');
const STATUS = require('../utilities/httpStatus');

const saleNotFoundResponse = (res) => res
  .status(STATUS.NOT_FOUND).json({ message: 'Sale not found' });

const getAll = async (_req, res) => {
  const sales = await salesService.getAll();
  return res.status(STATUS.OK).json(sales);
};

const getById = async (req, res) => {
  const { params: { id } } = req;
  const sale = await salesService.getById(id);
  return sale
    ? res.status(STATUS.OK).json(sale)
    : saleNotFoundResponse(res);
};

const add = async (req, res) => {
  const { body: sales } = req;
  const addedSales = await salesService.add(sales);
  return res.status(STATUS.CREATED).json(addedSales);
};

const edit = async (req, res) => {
  const { params: { id: saleId }, body: products } = req;
  const editedSale = await salesService.edit({ saleId, products });
  return editedSale
    ? res.status(STATUS.OK).json(editedSale)
    : saleNotFoundResponse(res);
};

const remove = async (req, res) => {
  const { params: { id } } = req;
  const sale = await salesService.getById(id);
  if (!sale) return saleNotFoundResponse(res);

  await salesService.remove(id);

  res.status(STATUS.NO_CONTENT).send();
};

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
};
