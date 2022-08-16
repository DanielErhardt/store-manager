const error = require('../utilities/expressError');

const validateQuantity = (quantity) => {
  if (typeof quantity === 'undefined') return error.badRequest('"quantity" is required');

  if (quantity < 1) {
    return error.unprocessableEntity('"quantity" must be greater than or equal to 1');
  }
};

const validateProductId = (productId) => {
  if (!productId) return error.badRequest('"productId" is required');
};

const validateSale = async (req, _res, next) => {
  const { body: sales } = req;

  for (let i = 0; i < sales.length; i += 1) {
    const { productId, quantity } = sales[i];
    const validationError = validateQuantity(quantity) || validateProductId(productId);
    if (validationError) next(validationError);
  } 

  next();
};

module.exports = validateSale;
