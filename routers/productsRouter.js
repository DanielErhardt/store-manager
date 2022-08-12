const express = require('express');
const productsController = require('../controllers/productsController');
const validateProduct = require('../middlewares/validateProduct');

const productsRouter = express.Router();

productsRouter.get('/search', productsController.getByName);

productsRouter.get('/', productsController.getAll);

productsRouter.get('/:id', productsController.getById);

productsRouter.post('/', validateProduct, productsController.add);

productsRouter.put('/:id', validateProduct, productsController.edit);

productsRouter.delete('/:id', productsController.remove);

module.exports = productsRouter;
