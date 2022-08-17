const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const productsModel = require('../../../models/productsModel');
const mocks = require('../../mocks');

describe('Running all tests for the productsModel file.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there is no product registered', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[], []]));
      after(() => connection.execute.restore());

      it('it returns an empty array', async () => {
        const productsList = await productsModel.getAll();
        expect(productsList).to.be.an('array');
        expect(productsList).to.be.empty;
      });
    });
  
    describe('When there are products registered', () => {
      before(() => sinon.stub(connection, 'execute').resolves([mocks.products, []]));
      after(() => connection.execute.restore());

      it('it returns an array of objects containing the properties "id" and "name".', async () => {
        const productsList = await productsModel.getAll();
        expect(productsList).to.be.an('array').that.is.not.empty;
        productsList.forEach((product) => expect(product).to.be.an('object').include.all.keys('id', 'name'));
      });
    });
  });

  describe('Tests the getById function.', () => {
    describe('When there is no product with the provided id', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[], []]));
      after(() => connection.execute.restore());

      it('it returns undefined', async () => {
        const product = await productsModel.getById(10000);
        expect(product).to.equal(undefined);
      });
    });
  
    describe('When there is a product with the provided id', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[mocks.products[0]], []]));
      after(() => connection.execute.restore());

      it('it returns an object with the properties "id" and "name".,', async () => {
        const product = await productsModel.getById(1);
        expect(product).to.be.an('object').that.includes.all.keys('id', 'name');
      });
    });
  });

  describe('Tests the getByName function.', () => {
    describe('When an empty string is passed', () => {
      before(() => sinon.stub(connection, 'execute').resolves([mocks.products], []));
      after(() => connection.execute.restore());
      it('it returns an array with all products.', async () => {
        const searchedProducts = await productsModel.getByName('');
        expect(searchedProducts).to.be.an('array').that.is.not.empty;
      });
    });

    describe('When a string with a partial name is passed', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[mocks.products[0]]], []));
      after(() => connection.execute.restore());
      it('it returns an array containg products with matching names.', async () => {
        const searchTerm = 'ham';
        const searchedProducts = await productsModel.getByName(searchTerm);
        expect(searchedProducts).to.be.an('array').that.is.not.empty;
        searchedProducts.forEach((product) => {
          expect(product).to.contain.all.keys('name', 'id');
          expect(product.name.toLowerCase().includes(searchTerm)).to.be.true;
        });
      });
    });
  });

  describe('Tests the productExists function.', () => {
    describe('When there is no product with the provided id', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[], []]));
      after(() => connection.execute.restore());
      it('it returns false', async () => {
        const productExists = await productsModel.productExists(1000);
        expect(productExists).to.equal(false);
      });
    });

    describe('When a product with the provided id is found', () => {
      before(() => sinon.stub(connection, 'execute').resolves([mocks.products, []]));
      after(() => connection.execute.restore());
      it('it returns true', async () => {
        const productExists = await productsModel.productExists(1);
        expect(productExists).to.equal(true);
      });
    });
  });

  describe('Tests the allProductsExist function.', () => {
    describe('When one or more products in the list are not found', () => {
      before(() => sinon.stub(connection, 'query').resolves([[{ 'COUNT(*)': 2 }], []]));
      after(() => connection.query.restore());

      it('it returns false', async () => {
        const productsExist = await productsModel.allProductsExist([1, 2, 3]);
        expect(productsExist).to.equal(false);
      });
    });

    describe('When all products in the list are cotained in the database', () => {
      before(() => sinon.stub(connection, 'query').resolves([[{ 'COUNT(*)': 3 }], []]));
      after(() => connection.query.restore());
      it('it returns true', async () => {
        const productsExist = await productsModel.allProductsExist([1, 2, 3]);
        expect(productsExist).to.equal(true);
      });
    });
  });

  describe('Tests the add function.', () => {
    describe('When a product name is added', () => {
      before(() => sinon.stub(connection, 'execute').resolves([{ insertId: 1 }, undefined]));
      after(() => connection.execute.restore());
      it('it returns an object containg the added product', async () => {
        const addedProduct = await productsModel.add('Hammer');
        expect(addedProduct).to.be.an('object').that.deep.equals({ id: 1, name: 'Hammer' });
      });
    });
  });

  describe('Tests the edit function.', () => {
    describe('When a product is passed', () => {
      before(() => sinon.stub(connection, 'execute').resolves([{}, undefined]));
      after(() => connection.execute.restore());
      it('it returns the edited product.', async () => {
        const editedProduct = { id: 1, name: 'Thor\'s Screwdriver' }
        const returnedProduct = await productsModel.edit(editedProduct)
        expect(returnedProduct).to.deep.equal(editedProduct);
      });
    });
  });

  describe('Tests the remove function.', () => {
    describe('When a product is removed', () => {
      before(() => sinon.stub(connection, 'execute').resolves([{ affectedRows: 1 }, undefined]));
      after(() => connection.execute.restore());
      it('it returns undefined.', async () => {
        const removalResult = await productsModel.remove(1);
        expect(removalResult).to.equal(undefined);
      });
    });
  });
});

// describe('', () => {
//   describe('', () => {
//     it('', async () => {

//     });
//   });
// });
