const chai = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const productsService = require('../../../services/productsService');
const mocks = require('../../mocks/queriesMocks');
const expressError = require('../../../utilities/expressError');

chai.use(require('chai-as-promised'));
const { expect } = chai;

describe('Running all tests for the productsService file.', () => {
  afterEach(() => sinon.restore());

  describe('Tests the getAll function.', () => {
    it('If there\'s one or more products in the database it returns an array of objects with the properties "id" and "name",', async () => {
      sinon.stub(connection, 'execute').resolves([mocks.selectAllProducts(), []]);
      const productsList = await productsService.getAll();
      expect(productsList).to.be.an('array').that.is.not.empty;
      productsList.forEach((product) => expect(product).to.be.an('object').include.all.keys('id', 'name'));
    });

    it('otherwise it returns an empty array.', async () => {
      sinon.stub(connection, 'execute').resolves([[], []]);
      expect(await productsService.getAll()).to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the getById function.', () => {
    it('If a product with the id exists it returns an object with the properties "id" and "name",', async () => {
      const providedId = 1;
      sinon.stub(connection, 'execute').resolves([mocks.selectProductWhereIdEquals(providedId), []]);
      const product = await productsService.getById(providedId);
      expect(product).to.be.an('object').that.includes.all.keys('id', 'name');
    });

    it('otherwise it throws a "Product not found" error.', async () => {
      const providedId = 9999;
      sinon.stub(connection, 'execute').resolves([mocks.selectProductWhereIdEquals(providedId), []]);
      await expect(productsService.getById(providedId)).to.be.rejectedWith(expressError.productNotFound.message);
    });
  });

  describe('Tests the getByName function.', () => {
    it('If the search term is an empty string it returns an array with all products.', async () => {
      const searchTerm = '';
      sinon.stub(connection, 'execute').resolves([mocks.selectProductsWhereNameLike(searchTerm), []]);
      expect(await productsService.getByName(searchTerm)).to.be.an('array').that.is.not.empty;
    });

    it('If the search term is contained in one or more product names it returns an array containg containing them,', async () => {
      const searchTerm = 'mar';
      sinon.stub(connection, 'execute').resolves([mocks.selectProductsWhereNameLike(searchTerm), []]);
      const searchedProducts = await productsService.getByName(searchTerm);
      expect(searchedProducts).to.be.an('array').that.is.not.empty;
      searchedProducts.forEach((product) => {
        expect(product).to.contain.all.keys('name', 'id');
        expect(product.name.toLowerCase().includes(searchTerm)).to.be.true;
      });
    });

    it('otherwise it throws a "Product not found" error.', async () => {
      const searchTerm = 'xablau';
      sinon.stub(connection, 'execute').resolves([mocks.selectProductsWhereNameLike(searchTerm), []]);
      await expect(productsService.getByName(searchTerm))
        .to.be.rejectedWith(expressError.productNotFound.message);
    });
  });

  describe('Tests the add function.', () => {
    it('When a name is passed it returns an object containg the added product.', async () => {
      const { insertId } = mocks.resultSetHeader;
      const productName = 'Stinky Cheese';
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
      const addedProduct = await productsService.add(productName);
      expect(addedProduct).to.be.an('object').that.deep.equals({ id: insertId, name: productName });
    });
  });

  describe('Tests the edit function.', () => {
    it('If a product with id exists it returns the edited product,', async () => {
      const editedProduct = { id: 1, name: 'Thor\'s Screwdriver' };
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(editedProduct.id), undefined]);
      expect(await productsService.edit(editedProduct)).to.deep.equal(editedProduct);
    });

    it('otherwise it throws a "Product not found" error.', async () => {
      const editedProduct = { id: 9999, name: 'Thor\'s Screwdriver' };
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(editedProduct.id), undefined]);
      await expect(productsService.edit(editedProduct))
        .to.be.rejectedWith(expressError.productNotFound.message);
    });
  });

  describe('Tests the remove function.', () => {
    it('If the product id exists it returns undefined,', async () => {
      const productId = 1;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(productId), undefined]);
      expect(await productsService.remove(productId)).to.equal(undefined);
    });

    it('otherwise it throws a "Product not found" error.', async () => {
      const productId = 9999;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(productId), undefined]);
      await expect(productsService.remove(productId))
        .to.be.rejectedWith(expressError.productNotFound.message);
    });
  });
});
