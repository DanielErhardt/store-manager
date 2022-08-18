const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const mocks = require('../../mocks/servicesMocks');
const testControllerFunction = require('../../../utilities/testControllerFunction');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');

describe('Running all tests for the Products Controller.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there are products registered', () => {
      before(() => sinon.stub(productsService, 'getAll').resolves(mocks.getAllProducts()));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing all products.', async () => {
        const result = await testControllerFunction(productsController.getAll);
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.not.empty;
      });

    });
    describe('When there are no products registered', () => {
      before(() => sinon.stub(productsService, 'getAll').resolves([]));
      after(() => sinon.restore());
  
      it('it responds with status 200 and a json containing an empty array.', async () => {
        const result = await testControllerFunction(productsController.getAll);
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('Tests the getById function.', () => {
    describe('When a product with the provided id is found', () => {
      const productId = 1;
      
      before(() => sinon.stub(productsService, 'getById').resolves(mocks.getProductById(productId)));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing the product.', async () => {
        const result = await testControllerFunction(productsController.getById, { params: {id: productId} });
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('object').that.includes.all.keys('id', 'name');
      });
    });
  });

  describe('Tests the getByName function.', () => {
    describe('When one or more products with matching names are found', () => {
      const searchTerm = 'de';
      
      before(() => sinon.stub(productsService, 'getByName').resolves(mocks.getProductsByName(searchTerm)));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing an array with the products.', async () => {
        const result = await testControllerFunction(productsController.getByName, { query: {q: searchTerm} });
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.not.empty;
      });
    });
  });

  describe('Tests the add function.', () => {
    describe('When the product is successfully added', () => {
      const productName = 'Crunchy Sand';
      
      before(() => sinon.stub(productsService, 'add').resolves(mocks.addProduct(productName)));
      after(() => sinon.restore());

      it('it responds with status 201 and a json containing the added product.', async () => {
        const result = await testControllerFunction(productsController.add, { body: {name: productName} });
        expect(result.status).to.equal(201);
        expect(result.json).to.be.an('object').that.includes.all.keys('id', 'name');
      });
    });
  });

  describe('Tests the edit function.', () => {
    describe('When the product is successfully edited', () => {
      const editedProduct = { id: 1, name: 'Crunchy Sand' };
      const { id, name } = editedProduct;
      
      before(() => sinon.stub(productsService, 'edit').resolves(mocks.editProduct(editedProduct)));
      after(() => sinon.restore());

      it('it responds with status 200 and a json containing the edited product.', async () => {
        const result = await testControllerFunction(productsController.edit, { body: { name }, params: { id } });
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('object').that.includes.all.keys('id', 'name');
      });
    });
  });

  describe('Tests the remove function.', () => {
    describe('When the product is successfully removed', () => {
      const productId = 1;
      
      before(() => sinon.stub(productsService, 'remove').resolves(undefined));
      after(() => sinon.restore());

      it('it responds with status 204 and sends nothing.', async () => {
        const result = await testControllerFunction(productsController.remove, { params: { id: productId } });
        expect(result.status).to.equal(204);
        expect(result.json).to.be.equal(undefined);
      });
    });
  });
});
