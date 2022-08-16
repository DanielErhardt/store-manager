const express = require('express');
const rescue = require('express-rescue');
const productsController = require('../controllers/productsController');
const validateProduct = require('../middlewares/validateProduct');

const productsRouter = express.Router();

productsRouter.get('/search', rescue(productsController.getByName));

productsRouter.get('/', rescue(productsController.getAll));

productsRouter.get('/:id', rescue(productsController.getById));

productsRouter.post('/', validateProduct, rescue(productsController.add));

productsRouter.put('/:id', validateProduct, rescue(productsController.edit));

productsRouter.delete('/:id', rescue(productsController.remove));

module.exports = productsRouter;
