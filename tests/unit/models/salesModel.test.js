const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesModel = require('../../../models/salesModel');
const mocks = require('../../mocks/queriesMocks');

describe('Running all tests for the salesModel file.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there is no sale registered', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[], []]));
      after(() => connection.execute.restore());

      it('it returns an empty array', async () => {
        const salesList = await salesModel.getAll();
        expect(salesList).to.be.an('array').that.is.empty;
      });
    });
  
    describe('When there are sales registered', () => {
      before(() => {
        sinon.stub(connection, 'execute')
          .onFirstCall().resolves([mocks.selectAllSales(), []])
          .resolves([mocks.selectAllSalesProducts(),[]]);
      });
      after(() => connection.execute.restore());

      it('it returns an array of objects containing the properties "saleId", "productId", "quantity" and "date".', async () => {
        const salesList = await salesModel.getAll();
        expect(salesList).to.be.an('array').that.is.not.empty;
        salesList.forEach((product) => expect(product).to.be.an('object').include.all.keys('saleId', 'productId', 'quantity', 'date'));
      });
    });
  });

  describe('Tests the getById function.', () => {
    describe('When there is no sale with the provided id', () => {
      const saleId = 9999;

      before(() => sinon.stub(connection, 'execute')
        .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
        .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]));
      after(() => connection.execute.restore());

      it('it returns an empty array.', async () => {
        const sale = await salesModel.getById(saleId);
        expect(sale).to.be.an('array').that.is.empty;
      });
    });
  
    describe('When there is a sale with the provided id', () => {
       const saleId = 1;

      before(() => sinon.stub(connection, 'execute')
        .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
        .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]));
      after(() => connection.execute.restore());

      it('it returns an array of objects with the properties "productId", "quantity" and "date".', async () => {
        const sales = await salesModel.getById(saleId);
        expect(sales).to.be.an('array').that.is.not.empty;
        sales.forEach((sale) => expect(sale).to.be.an('object').that.includes.all.keys('productId', 'quantity', 'date'));          
      });
    });
  });

  describe('Tests the saleExists function.', () => {
    describe('When there is no sale with the provided id', () => {
      const saleId = 9999;

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), []]));
      after(() => connection.execute.restore());

      it('it returns false', async () => {
        const saleExists = await salesModel.saleExists(saleId);
        expect(saleExists).to.equal(false);
      });
    });

    describe('When a sale with the provided id is found', () => {
      const saleId = 1;

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), []]));
      after(() => connection.execute.restore());

      it('it returns true', async () => {
        const saleExists = await salesModel.saleExists(saleId);
        expect(saleExists).to.equal(true);
      });
    });
  });

  describe('Tests the add function.', () => {
    describe('When a sale is registered', () => {
      const { insertId } = mocks.resultSetHeader;
      const soldProducts = [{ id: 1, quantity: 10 }, { id: 2, quantity: 4 }];

      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.resultSetHeader, undefined]));
      after(() => connection.execute.restore());

      it('it returns an object containg the registered sale', async () => {
        const addedSale = await salesModel.add(soldProducts);
        expect(addedSale).to.be.an('object').that.deep.equals({ id: insertId, itemsSold: soldProducts });
      });
    });
  });

  describe('Tests the edit function.', () => {
    describe('When a sale is passed for editing', () => {
      before(() => sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]));
      after(() => connection.execute.restore());

      it('it returns the edited sale.', async () => {
        const editedSale = { saleId: 1, products : [{ productId: 1, quantity: 7 }]}
        const returnedSale = await salesModel.edit(editedSale)
        expect(returnedSale).to.be.an('object')
          .that.deep.equals({ saleId: editedSale.saleId, itemsUpdated: editedSale.products });
      });
    });
  });

  describe('Tests the remove function.', () => {
    describe('When a sale is removed', () => {
      before(() => sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]));
      after(() => connection.execute.restore());

      it('it returns undefined.', async () => {
        const removalResult = await salesModel.remove(1);
        expect(removalResult).to.equal(undefined);
      });
    });
  });
});
