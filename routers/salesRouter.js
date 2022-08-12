const express = require('express');
const salesController = require('../controllers/salesController');
const validateSale = require('../middlewares/validateSale');

const salesRouter = express.Router();

salesRouter.get('/', salesController.getAll);

salesRouter.get('/:id', salesController.getById);

salesRouter.post('/', validateSale, salesController.add);

salesRouter.put('/:id', validateSale, salesController.edit);

salesRouter.delete('/:id', salesController.remove);

module.exports = salesRouter;
