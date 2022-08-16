const express = require('express');
const rescue = require('express-rescue');
const salesController = require('../controllers/salesController');
const validateSale = require('../middlewares/validateSale');

const salesRouter = express.Router();

salesRouter.get('/', rescue(salesController.getAll));

salesRouter.get('/:id', rescue(salesController.getById));

salesRouter.post('/', validateSale, rescue(salesController.add));

salesRouter.put('/:id', validateSale, rescue(salesController.edit));

salesRouter.delete('/:id', rescue(salesController.remove));

module.exports = salesRouter;
