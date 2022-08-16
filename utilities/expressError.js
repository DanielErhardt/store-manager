const httpStatus = require('./httpStatus');

const badRequest = (message = 'Bad Request Error') => ({
  type: 'Bad Request Error',
  message,
  status: httpStatus.BAD_REQUEST,
});

const unprocessableEntity = (message = 'Unprocessable Entity Error') => ({
  type: 'Unprocessable Entity Error',
  message,
  status: httpStatus.UNPROCESSABLE_ENTITY,
});

const notFound = (message = 'Not Found Error') => ({
  type: 'Not Found Error',
  message,
  status: httpStatus.NOT_FOUND,
});

module.exports = {  
  badRequest,
  unprocessableEntity,
  notFound,
  productNotFound: notFound('Product not found'),
  saleNotFound: notFound('Sale not found'),
};