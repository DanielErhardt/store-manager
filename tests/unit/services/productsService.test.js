const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const productsService = require('../../../services/productsService');
const mocks = require('../../mocks/queriesMocks');

const expressError = require('../../../utilities/expressError');

describe('Running all tests for the productsService file.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there is no product registered', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[], []]));
      after(() => connection.execute.restore());

      it('it returns an empty array', async () => {
        const productsList = await productsService.getAll();
        expect(productsList).to.be.an('array').that.is.empty;
      });
    });
  
    describe('When there are products registered', () => {
      before(() => sinon.stub(connection, 'execute').resolves([mocks.selectAllProducts(), []]));
      after(() => connection.execute.restore());

      it('it returns an array of objects containing the properties "id" and "name".', async () => {
        const productsList = await productsService.getAll();
        expect(productsList).to.be.an('array').that.is.not.empty;
        productsList.forEach((product) => expect(product).to.be.an('object').include.all.keys('id', 'name'));
      });
    });
  });

  describe('Tests the getById function.', () => {
    describe('When there is no product with the provided id', () => {
      const providedId = 9999;
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(providedId), []]));
      after(() => connection.execute.restore());

      it('it throws a "Product not found" error.', async () => {
        try {
          await productsService.getById(providedId);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.productNotFound);
        }
      });
    });
  
    describe('When there is a product with the provided id', () => {
      const providedId = 1;

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(providedId), []]));
      after(() => connection.execute.restore());

      it('it returns an object with the properties "id" and "name".,', async () => {
        const product = await productsService.getById(providedId);
        expect(product).to.be.an('object').that.includes.all.keys('id', 'name');
      });
    });
  });

  describe('Tests the getByName function.', () => {
    describe('When an empty string is passed', () => {
      const searchTerm = '';

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductsWhereNameLike(searchTerm), []]));
      after(() => connection.execute.restore());
      
      it('it returns an array with all products.', async () => {
        const searchedProducts = await productsService.getByName(searchTerm);
        expect(searchedProducts).to.be.an('array').that.is.not.empty;
      });
    });

    describe('When a string with a partial name is passed', () => {
      const searchTerm = 'mar';

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductsWhereNameLike(searchTerm), []]));
      after(() => connection.execute.restore());

      it('it returns an array containg products with matching names.', async () => {
        const searchedProducts = await productsService.getByName(searchTerm);
        expect(searchedProducts).to.be.an('array').that.is.not.empty;
        searchedProducts.forEach((product) => {
          expect(product).to.contain.all.keys('name', 'id');
          expect(product.name.toLowerCase().includes(searchTerm)).to.be.true;
        });
      });
    });

    describe('When there are no product with matching names', () => {
      const searchTerm = 'xablau';

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductsWhereNameLike(searchTerm), []]));
      after(() => connection.execute.restore());
      
      it('it throws a "Product not found" error.', async () => {
        try {
          await productsService.getByName(searchTerm);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.productNotFound);
        }
      });
    })
  });

  describe('Tests the add function.', () => {
    describe('When a product name is added', () => {
      const { insertId } = mocks.resultSetHeader;
      const productName = 'Stinky Cheese';

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.resultSetHeader, undefined]));
      after(() => connection.execute.restore());
      it('it returns an object containg the added product', async () => {
        const addedProduct = await productsService.add(productName);
        expect(addedProduct).to.be.an('object').that.deep.equals({ id: insertId, name: productName });
      });
    });
  });

  describe('Tests the edit function.', () => {
    describe('When a product with an existing id is passed', () => {
      const editedProduct = { id: 1, name: 'Thor\'s Screwdriver' };
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(editedProduct.id), undefined]));
      after(() => connection.execute.restore());

      it('it returns the edited product.', async () => {
        const returnedProduct = await productsService.edit(editedProduct)
        expect(returnedProduct).to.deep.equal(editedProduct);
      });
    });

    describe('When a product with an unregistered id is passed', () => {
      const editedProduct = { id: 9999, name: 'Thor\'s Screwdriver' };
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(editedProduct.id), undefined]));
      after(() => connection.execute.restore());
      
      it('it throws a "Product not found" error.', async () => {
        try {
          await productsService.edit(editedProduct);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.productNotFound);
        }
      });
    });
  });

  describe('Tests the remove function.', () => {
   describe('When an existing product id is passed', () => {
      const productId = 1;
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(productId), undefined]));
      after(() => connection.execute.restore());

      it('it returns undefined.', async () => {
        const returnedProduct = await productsService.remove(productId)
        expect(returnedProduct).to.equal(undefined);
      });
    });

    describe('When a product with an unregistered id is passed', () => {
      const productId = 9999;
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectProductWhereIdEquals(productId), undefined]));
      after(() => connection.execute.restore());
      
      it('it throws a "Product not found" error.', async () => {
        try {
          await productsService.remove(productId);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.productNotFound);
        }
      });
    });
  });
});
