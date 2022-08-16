const rescue = require('express-rescue');
const salesService = require('../services/salesService');
const httpStatus = require('../utilities/httpStatus');

const getAll = async (_req, res) => {
  const sales = await salesService.getAll();
  return res.status(httpStatus.OK).json(sales);
};

const getById = rescue(async (req, res) => {
  const { params: { id } } = req;
  const sale = await salesService.getById(id);
  return res.status(httpStatus.OK).json(sale);
});

const add = rescue(async (req, res) => {
  const { body: sale } = req;
  const addResult = await salesService.add(sale);
  return res.status(httpStatus.CREATED).json(addResult);
});

const edit = rescue(async (req, res) => {
  const { params: { id: saleId }, body: products } = req;
  const editResult = await salesService.edit({ saleId, products });
  return res.status(httpStatus.OK).json(editResult);
});

const remove = rescue(async (req, res) => {
  const { params: { id } } = req;
  await salesService.remove(id);  
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
};
