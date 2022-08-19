const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const mocks = require('../../mocks/servicesMocks');
const testControllerFunction = require('../../../utilities/testControllerFunction');

const salesService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');

describe('Running all tests for the Sales Controller.', () => {
  afterEach(() => sinon.restore());

  describe('Tests the getAll function.', () => {
    it('If there are sales registered it responds with status 200 and a json containing all sales,', async () => {
      sinon.stub(salesService, 'getAll').resolves(mocks.getAllSales());
      const { status, json } = await testControllerFunction(salesController.getAll);
      expect(status).to.equal(200);
      expect(json).to.be.an('array').that.is.not.empty;
      json.forEach((sale) => expect(sale)
        .to.be.an('object')
        .that.includes.all.keys('saleId', 'productId', 'date', 'quantity'));
    });

    it('otherwise it responds with status 200 and an empty array.', async () => {
      sinon.stub(salesService, 'getAll').resolves([]);
      const { status, json } = await testControllerFunction(salesController.getAll);
      expect(status).to.equal(200);
      expect(json).to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the getById function.', () => {
    it('When a sale is found it responds with status 200 and a json containing the sale,', async () => {
      const saleId = 1;
      sinon.stub(salesService, 'getById').resolves(mocks.getSaleById(saleId));
      const { status, json } = await testControllerFunction(salesController.getById, { params: { id: saleId } });
      expect(status).to.equal(200);
      expect(json).to.be.an('array').that.is.not.empty;
      json.forEach((sale) => expect(sale).to.be.an('object')
        .that.includes.all.keys('productId', 'date', 'quantity'))
    });
  });

  describe('Tests the add function.', () => {
    it('When a valid sale is added it responds with status 201 and a json containing the added sale.', async () => {
      const itemsSold = [{ id: 1, quantity: 5 }, { id: 2, quantity: 10 }];
      sinon.stub(salesService, 'add').resolves(mocks.addSale(itemsSold))
      const { status, json } = await testControllerFunction(salesController.add, { body: itemsSold });
      expect(status).to.equal(201);
      expect(json).to.be.an('object').that.includes.all.keys('id', 'itemsSold');
      json.itemsSold.forEach((item) => expect(item)
        .to.be.an('object').that.includes.all.keys('id', 'quantity'));
    });
  });

  describe('Tests the edit function.', () => {
    it('When a sale is edited it responds with status 200 and a json containing the edited sale.', async () => {
      const editedSale = { id: 1, itemsUpdated: [] };
      const { id, itemsUpdated } = editedSale;
      sinon.stub(salesService, 'edit').resolves(mocks.editSale(editedSale));
      const { status, json } = await testControllerFunction(salesController.edit, { body: itemsUpdated, params: { id } });
      expect(status).to.equal(200);
      expect(json).to.be.an('object').that.includes.all.keys('id', 'itemsUpdated');
    });
  });

  describe('Tests the remove function.', () => {
    describe('When the sale is successfully removed', () => {
      it('When a sale is removed it responds with status 204 and sends nothing.', async () => {
        sinon.stub(salesService, 'remove').resolves(undefined)
        const { status, json } = await testControllerFunction(salesController.remove, { params: { id: 1 } });
        expect(status).to.equal(204);
        expect(json).to.be.equal(undefined);
      });
    });
  });
});
