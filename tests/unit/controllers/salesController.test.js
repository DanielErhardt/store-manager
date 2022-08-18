const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const mocks = require('../../mocks/servicesMocks');
const testControllerFunction = require('../../../utilities/testControllerFunction');

const salesService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');

describe('Running all tests for the Sales Controller.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there are sales registered', () => {
      before(() => sinon.stub(salesService, 'getAll').resolves(mocks.getAllSales()));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing all sales.', async () => {
        const result = await testControllerFunction(salesController.getAll);
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.not.empty;
        result.json.forEach((sale) => expect(sale)
          .to.be.an('object')
          .that.includes.all.keys('saleId', 'productId', 'date', 'quantity'));
      });

    });
    describe('When there are no sales registered', () => {
      before(() => sinon.stub(salesService, 'getAll').resolves([]));
      after(() => sinon.restore());
  
      it('it responds with status 200 and a json containing an empty array.', async () => {
        const result = await testControllerFunction(salesController.getAll);
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('Tests the getById function.', () => {
    describe('When a sale with the provided id is found', () => {
      const saleId = 1;
      
      before(() => sinon.stub(salesService, 'getById').resolves(mocks.getSaleById(saleId)));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing the sale.', async () => {
        const result = await testControllerFunction(salesController.getById, { params: {id: saleId} });
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.not.empty;
        result.json.forEach((sale) => expect(sale)
          .to.be.an('object')
          .that.includes.all.keys('productId', 'date', 'quantity'))
      });
    });
  });

  describe('Tests the add function.', () => {
    describe('When a sale is successfully added', () => {
      const itemsSold = [{ id: 1, quantity: 5 }, { id: 2, quantity: 10 }];
      
      before(() => sinon.stub(salesService, 'add').resolves(mocks.addSale(itemsSold)));
      after(() => sinon.restore());

      it('it responds with status 201 and a json containing the added sale.', async () => {
        const result = await testControllerFunction(salesController.add, { body: itemsSold });
        expect(result.status).to.equal(201);
        expect(result.json).to.be.an('object').that.includes.all.keys('id', 'itemsSold');
        result.json.itemsSold.forEach((item) => expect(item)
          .to.be.an('object')
          .that.includes.all.keys('id', 'quantity'));
      });
    });
  });

  describe('Tests the edit function.', () => {
    describe('When the sale is successfully edited', () => {
      const editedSale = { id: 1, itemsUpdated: [] };
      const { id, itemsUpdated } = editedSale;
      
      before(() => sinon.stub(salesService, 'edit').resolves(mocks.editSale(editedSale)));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing the edited sale.', async () => {
        const result = await testControllerFunction(salesController.edit, { body: itemsUpdated, params: { id } });
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('object').that.includes.all.keys('id', 'itemsUpdated');
      });
    });
  });

  describe('Tests the remove function.', () => {
    describe('When the sale is successfully removed', () => {
      const saleId = 1;
      
      before(() => sinon.stub(salesService, 'remove').resolves(undefined));
      after(() => sinon.restore());

      it('it responds with status 204 and sends nothing.', async () => {
        const result = await testControllerFunction(salesController.remove, { params: { id: saleId } });
        expect(result.status).to.equal(204);
        expect(result.json).to.be.equal(undefined);
      });
    });
  });
});
