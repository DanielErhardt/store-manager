const error = require('../utilities/expressError');

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
    if (error) next(error);
  } 

  const idError = await verifyDatabaseProductsId(sales.map(({ productId }) => productId));
  return idError ? next(idError) : next();
};

module.exports = validateSale;
