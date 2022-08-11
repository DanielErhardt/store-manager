const STATUS = require('../utilities/httpStatus');
const Error = require('../classes/CustomError');

const validateProduct = async (req, res, next) => {
  const { body: { name } } = req;

  if (!name) {
    next(new Error(STATUS.BAD_REQUEST, '"name" is required'));
    return;
  }

  if (name.length < 5) {
    next(new Error(
      STATUS.UNPROCESSABLE_ENTITY,
      '"name" length must be at least 5 characters long',
    ));
    return;
  }

  next();
};

module.exports = validateProduct;
