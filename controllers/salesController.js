const salesService = require('../services/salesService');
const STATUS = require('../utilities/httpStatus');

const add = async (req, res) => {
  const { body: sales } = req;
  const addedSales = await salesService.add(sales);
  return res.status(STATUS.CREATED).json(addedSales);
};

module.exports = {
  add,
};
