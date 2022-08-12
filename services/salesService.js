const salesModel = require('../models/salesModel');

const getAll = async () => salesModel.getAll();

const getById = async (id) => salesModel.getById(id);

const add = async (sales) => salesModel.add(sales);

const edit = async (sale) => salesModel.edit(sale);

const remove = async (id) => salesModel.remove(id);

module.exports = {
  getAll,
  getById,
  add,
  edit,
  remove,
};
