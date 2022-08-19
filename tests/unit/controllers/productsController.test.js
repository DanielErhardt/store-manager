const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const mocks = require('../../mocks/servicesMocks');
const testControllerFunction = require('../../../utilities/testControllerFunction');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');

describe('Running all tests for the Products Controller.', () => {
  afterEach(() => sinon.restore());

  describe('Tests the getAll function.', () => {
    it('When there\'s one or more products registered it responds with status 200 and a json containing them,', async () => {
      sinon.stub(productsService, 'getAll').resolves(mocks.getAllProducts());
      const { status, json } = await testControllerFunction(productsController.getAll);
      expect(status).to.equal(200);
      expect(json).to.be.an('array').that.is.not.empty;
    });

    it('otherwise it responds with status 200 and a json containing an empty array.', async () => {
      sinon.stub(productsService, 'getAll').resolves([]);
      const { status, json } = await testControllerFunction(productsController.getAll);
      expect(status).to.equal(200);
      expect(json).to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the getById function.', () => {
    it('If a product is found it responds with status 200 and a json containing the product.', async () => {
      const productId = 1;
      sinon.stub(productsService, 'getById').resolves(mocks.getProductById(productId));
      const { status, json } = await testControllerFunction(productsController.getById, { params: { id: productId } });
      expect(status).to.equal(200);
      expect(json).to.be.an('object').that.includes.all.keys('id', 'name');
    });
  });

  describe('Tests the getByName function.', () => {
    it('If one or more products are found it responds with status 200 and a json containing an array with them.', async () => {
      const searchTerm = 'de';
      sinon.stub(productsService, 'getByName').resolves(mocks.getProductsByName(searchTerm));
      const { status, json } = await testControllerFunction(productsController.getByName, { query: { q: searchTerm } });
      expect(status).to.equal(200);
      expect(json).to.be.an('array').that.is.not.empty;
    });
  });

  describe('Tests the add function.', () => {
    it('When a product is added it responds with status 201 and a json containing it.', async () => {
      const productName = 'Crunchy Sand';
      sinon.stub(productsService, 'add').resolves(mocks.addProduct(productName))
      const { status, json } = await testControllerFunction(productsController.add, { body: { name: productName } });
      expect(status).to.equal(201);
      expect(json).to.be.an('object').that.includes.all.keys('id', 'name');
    });
  });

  describe('Tests the edit function.', () => {
    it('When a product is edited it responds with status 200 and a json containing it.', async () => {
      const editedProduct = { id: 1, name: 'Crunchy Sand' };
      const { id, name } = editedProduct;
      sinon.stub(productsService, 'edit').resolves(mocks.editProduct(editedProduct));
      const { status, json } = await testControllerFunction(productsController.edit, { body: { name }, params: { id } });
      expect(status).to.equal(200);
      expect(json).to.be.an('object').that.includes.all.keys('id', 'name');
    });
  });

  describe('Tests the remove function.', () => {
    it('When a product is removed it responds with status 204 and sends nothing.', async () => {
      const productId = 1;
      sinon.stub(productsService, 'remove').resolves(undefined);
      const { status, json } = await testControllerFunction(productsController.remove, { params: { id: productId } });
      expect(status).to.equal(204);
      expect(json).to.be.equal(undefined);
    });
  });
});
