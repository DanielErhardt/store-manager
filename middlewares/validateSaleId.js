const connection = require('../models/connection');
const STATUS = require('../utilities/httpStatus');
const Error = require('../classes/CustomError');

const validateSaleId = async (req, _res, next) => {
  const { params: { id } } = req;
  const [sale] = await connection.query('SELECT * FROM StoreManager.sales WHERE id = ?;', [id]);

  if (sale.length === 0) return next(new Error(STATUS.NOT_FOUND, 'Sale not found'));

  next();
};

module.exports = validateSaleId;