const express = require('express');
const salesController = require('../controllers/salesController');
const validateSale = require('../middlewares/validateSale');

const salesRouter = express.Router();

salesRouter.post('/', validateSale, salesController.add);

module.exports = salesRouter;
