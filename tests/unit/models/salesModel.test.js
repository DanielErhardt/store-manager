const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesModel = require('../../../models/salesModel');
const mocks = require('../../mocks/queriesMocks');

describe('Running all tests for the salesModel file.', () => {
  afterEach(() => sinon.restore());

  describe('Tests the getAll function.', () => {
    it(`If one or more sales are found it returns an array of objects
      containing the properties "saleId", "productId", "quantity" and "date",`, async () => {
      sinon.stub(connection, 'execute')
        .onFirstCall().resolves([mocks.selectAllSales(), []])
        .resolves([mocks.selectAllSalesProducts(), []])
      const salesList = await salesModel.getAll();
      expect(salesList).to.be.an('array').that.is.not.empty;
      salesList.forEach((product) => expect(product).to.be.an('object')
        .that.includes.all.keys('saleId', 'productId', 'quantity', 'date'));
    });

    it('otherwise it returns an empty array.', async () => {
      sinon.stub(connection, 'execute').resolves([[], []]);
      expect(await salesModel.getAll()).to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the getById function.', () => {
    it(`If a sale with the id is found it returns an array of
      objects with the properties "productId", "quantity" and "date",`, async () => {
      const saleId = 1;
      sinon.stub(connection, 'execute')
        .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
        .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]);
      const sales = await salesModel.getById(saleId);
      expect(sales).to.be.an('array').that.is.not.empty;
      sales.forEach((sale) => expect(sale).to.be.an('object').that.includes.all.keys('productId', 'quantity', 'date'));
    });
    
    it('otherwise it returns an empty array.', async () => {
      const saleId = 9999;
      sinon.stub(connection, 'execute')
        .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
        .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]);
      expect(await salesModel.getById(saleId)).to.be.an('array').that.is.empty;
    });
  });

  describe('Tests the saleExists function.', () => {
    it('When a sale with the provided id is found it returns true,', async () => {
      const saleId = 1;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), []]);
      expect(await salesModel.saleExists(saleId)).to.equal(true);
    });
    
    it('otherwise it returns false.', async () => {
      const saleId = 9999;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), []]);
      expect(await salesModel.saleExists(saleId)).to.equal(false);
    });
  });

  describe('Tests the add function.', () => {
    it('When a sale is registered it returns an object containg the registered sale', async () => {
      const { insertId } = mocks.resultSetHeader;
      const soldProducts = [{ id: 1, quantity: 10 }, { id: 2, quantity: 4 }];
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
      expect(await salesModel.add(soldProducts))
        .to.be.an('object').that.deep.equals({ id: insertId, itemsSold: soldProducts });
    });
  });

  describe('Tests the edit function.', () => {
    it('When a sale is passed for editing it returns the edited sale.', async () => {
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
      const editedSale = { saleId: 1, products: [{ productId: 1, quantity: 7 }] };
      expect(await salesModel.edit(editedSale)).to.be.an('object')
        .that.deep.equals({ saleId: editedSale.saleId, itemsUpdated: editedSale.products });
    });
  });

  describe('Tests the remove function.', () => {
    it('When a sale is removed it returns undefined.', async () => {
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
      expect(await salesModel.remove(1)).to.equal(undefined);
    });
  });
});
