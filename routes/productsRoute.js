const express = require('express');
const productsController = require('../controllers/productsController');
const validateProduct = require('../middlewares/validateProduct');

const productsRoute = express.Router();

productsRoute.get('/', productsController.getAll);

productsRoute.get('/:id', productsController.getById);

productsRoute.post('/', validateProduct, productsController.add);

module.exports = productsRoute;
