const express = require('express');
const salesController = require('../controllers/salesController');
const validateSale = require('../middlewares/validateSale');

const salesRoute = express.Router();

salesRoute.post('/', validateSale, salesController.add);

module.exports = salesRoute;
