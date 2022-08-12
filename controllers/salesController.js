const salesService = require('../services/salesService');
const STATUS = require('../utilities/httpStatus');

const getAll = async (_req, res) => {
  const sales = await salesService.getAll();
  return res.status(STATUS.OK).json(sales);
};

const getById = async (req, res) => {
  const { params: { id } } = req;
  const sale = await salesService.getById(id);
  return sale
    ? res.status(STATUS.OK).json(sale)
    : res.status(STATUS.NOT_FOUND).json({ message: 'Sale not found' });
};

const add = async (req, res) => {
  const { body: sales } = req;
  const addedSales = await salesService.add(sales);
  return res.status(STATUS.CREATED).json(addedSales);
};

module.exports = {
  getAll,
  getById,
  add,
};
