const connection = require('../models/connection');
const STATUS = require('../utilities/httpStatus');
const Error = require('../classes/CustomError');

const verifyDatabaseProductsId = async (idList) => {
  // const mappedIds = idList.map(async (id) => {
  //   const [result] = await connection
  //     .query('SELECT * FROM StoreManager.products AS P WHERE P.id = ?;', [id]);
  //   return result.length > 0;
  // });

  // const resolved = await Promise.all(mappedIds);
  // if (resolved.some((condition) => !condition)) {
  //   return new Error(STATUS.NOT_FOUND, 'Product not found');
  // }

  const [[result]] = await connection
    .query('SELECT COUNT(*) FROM StoreManager.products AS P WHERE P.id IN (?)', [idList]);
  
  if (result['COUNT(*)'] !== idList.length) {
    return new Error(STATUS.NOT_FOUND, 'Product not found');
  }
};

const validateQuantity = (quantity) => {
  if (typeof quantity === 'undefined') {
    return new Error(STATUS.BAD_REQUEST, '"quantity" is required');
  }

  if (quantity < 1) {
    return new Error(STATUS.UNPROCESSABLE_ENTITY, '"quantity" must be greater than or equal to 1');
  }
};

const validateProductId = (productId) => {
  if (!productId) {
    return new Error(STATUS.BAD_REQUEST, '"productId" is required');
  }
};

const validateSale = async (req, _res, next) => {
  const { body: sales } = req;

  for (let i = 0; i < sales.length; i += 1) {
    const { productId, quantity } = sales[i];
    const error = validateQuantity(quantity) || validateProductId(productId);
    if (error) {
      next(error);
      return;
    }
  } 

  const idError = await verifyDatabaseProductsId(sales.map(({ productId }) => productId));

  if (idError) {
    next(idError);
    return;
  }

  next();
};

module.exports = validateSale;
