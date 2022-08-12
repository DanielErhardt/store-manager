const salesModel = require('../models/salesModel');

const getAll = async () => salesModel.getAll();

const getById = async (id) => salesModel.getById(id);

const add = async (sales) => salesModel.add(sales);

const edit = async (sale) => salesModel.edit(sale);

module.exports = {
  getAll,
  getById,
  add,
  edit,
};
