const error = require('../utilities/expressError');

const validateProduct = async (req, _res, next) => {
  const { body: { name } } = req;

  if (!name) return next(error.badRequest('"name" is required'));

  if (name.length < 5) {
    return next(error.unprocessableEntity('"name" length must be at least 5 characters long'));
  }

  next();
};

module.exports = validateProduct;
