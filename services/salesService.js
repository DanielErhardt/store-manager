const salesModel = require('../models/salesModel');

const add = async (sales) => salesModel.add(sales);

module.exports = {
  add,
};
