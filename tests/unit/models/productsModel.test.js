const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const productsModel = require('../../../models/productsModel');
const mocks = require('../../mocks/queriesMocks');

describe('Running all tests for the productsModel file.', () => {
  afterEach(() => sinon.restore());

  describe('Tests the getAll function.', () => {
    it('If there\'s one or more products registered, it returns an array of objects containing the properties "id" and "name".',
      async () => {
        sinon.stub(connection, 'execute').resolves([mocks.selectAllProducts(), []]);
        const productsList = await productsModel.getAll();
        expect(productsList).to.be.an('array').that.is.not.empty;
        productsList.forEach((product) => expect(product).to.be.an('object').include.all.keys('id', 'name'));
      });
    
    it('If there are no products registered it returns an empty array.', async () => {
      sinon.stub(connection, 'execute').resolves([[], []]);
      expect(await productsModel.getAll()).to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the getById function.', () => {
    it('If there\'s no product with id it returns an object with the properties "id" and "name",,', async () => {
      const providedId = 1;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(providedId), []]);
      expect(await productsModel.getById(providedId))
        .to.be.an('object').that.includes.all.keys('id', 'name');
    });

    it('otherwise it returns undefined,', async () => {
      const providedId = 9999;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(providedId), []]);
      expect(await productsModel.getById(providedId)).to.equal(undefined);
    });
  });

  describe('Tests the getByName function.', () => {
    it('If the search term is an empty string it returns an array with all products.', async () => {
      const searchTerm = '';
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductsWhereNameLike(searchTerm), []]);
      expect(await productsModel.getByName(searchTerm))
        .to.be.an('array').that.is.not.empty;
    });

    it('If the search term is contained in one or more product names it returns an array containg containing them,', async () => {
      const searchTerm = 'mar';
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductsWhereNameLike(searchTerm), []]);
      const searchResult = await productsModel.getByName(searchTerm);
      expect(searchResult).to.be.an('array').that.is.not.empty;
      searchResult.forEach((product) => {
        expect(product).to.contain.all.keys('name', 'id');
        expect(product.name.toLowerCase().includes(searchTerm)).to.be.true;
      });
    });

    it('otherwise it throws a "Product not found" error.', async () => {
      const searchTerm = 'xablau';
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductsWhereNameLike(searchTerm), []])
      expect(await productsModel.getByName(searchTerm))
        .to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the productExists function.', () => {
      it('If a product with id exists it returns true,', async () => {
        const providedId = 1;
        sinon.stub(connection, 'execute')
          .resolves([mocks.selectProductWhereIdEquals(providedId), []]);
        expect(await productsModel.productExists(providedId)).to.equal(true);
      });
    
      it('otherwise it returns false.', async () => {
        const providedId = 9999;
        sinon.stub(connection, 'execute')
          .resolves([mocks.selectProductWhereIdEquals(providedId), []]);
        expect(await productsModel.productExists(providedId)).to.equal(false);
      });
  });

  describe('Tests the allProductsExist function.', () => {
    it('If every product id in the list exists in the database it returns true,', async () => {
      const idList = [1, 2, 3];
      sinon.stub(connection, 'query')
        .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
      expect(await productsModel.allProductsExist(idList)).to.equal(true);
    });

    it('otherwise it returns false.', async () => {
      const idList = [1, 3, 5];
      sinon.stub(connection, 'query')
        .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
      expect(await productsModel.allProductsExist(idList)).to.equal(false);
    });
  });

  describe('Tests the add function.', () => {
    it('When a product name is added it returns an object containg the added product', async () => {
      const { insertId } = mocks.resultSetHeader;
      const productName = 'Stinky Cheese';
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
      expect(await productsModel.add(productName))
        .to.be.an('object').that.deep.equals({ id: insertId, name: productName });
    });
  });

  describe('Tests the edit function.', () => {
    it('When a product is passed it returns the edited product.', async () => {
      sinon.stub(connection, 'execute').resolves([{}, undefined]);
      const editedProduct = { id: 1, name: 'Thor\'s Screwdriver' };
      expect(await productsModel.edit(editedProduct)).to.deep.equal(editedProduct);
    });
  });

  describe('Tests the remove function.', () => {
    it('When a product is removed it returns undefined.', async () => {
      sinon.stub(connection, 'execute').resolves([{}, undefined]);
      expect(await productsModel.remove(1)).to.equal(undefined);
    });
  });
});
