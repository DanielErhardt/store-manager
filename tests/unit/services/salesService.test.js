const chai = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesService = require('../../../services/salesService');
const mocks = require('../../mocks/queriesMocks');
const expressError = require('../../../utilities/expressError');

chai.use(require('chai-as-promised'));
const { expect } = chai;

describe('Running all tests for the salesService file.', () => {
  afterEach(() => sinon.restore());

  describe('Tests the getAll function.', () => {
    it('If there are no sales registered it returns an empty array', async () => {
      sinon.stub(connection, 'execute').resolves([[], []]);
      expect(await salesService.getAll()).to.be.an('array').that.is.empty;
    });
  
    it('If there\'s one or more sales, it returns an array of objects containing the properties "saleId", "productId", "quantity" and "date".',
      async () => {
        sinon.stub(connection, 'execute')
          .onFirstCall().resolves([mocks.selectAllSales(), []])
          .resolves([mocks.selectAllSalesProducts(), []]);
        const salesList = await salesService.getAll();
        expect(salesList).to.be.an('array').that.is.not.empty;
        salesList.forEach((product) => expect(product)
          .to.be.an('object')
          .that.includes.all.keys('saleId', 'productId', 'quantity', 'date'));
      });
  });

  describe('Tests the getById function.', () => {
    it('If no sale is found, it throws a "Sale not found" error.',
      async () => {
        const saleId = 9999;
        sinon.stub(connection, 'execute')
          .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
          .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]);
        await expect(salesService.getById(saleId))
          .to.be.rejectedWith(expressError.saleNotFound.message);
      });
  
    it('If a sale is found, it returns an array of objects with the properties "productId", "quantity" and "date".',
      async () => {
        const saleId = 1;
        sinon.stub(connection, 'execute')
          .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
          .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]);
        const sales = await salesService.getById(saleId);
        expect(sales).to.be.an('array').that.is.not.empty;
        sales.forEach((sale) => expect(sale).to.be.an('object').that.includes.all.keys('productId', 'quantity', 'date'));
      });
  });

  describe('Tests the add function.', () => {
    it('If the added sale contains valid items it returns an object containg the registered sale,', async () => {
      const { insertId } = mocks.resultSetHeader;
      const soldProducts = [{ productId: 1, quantity: 10 }, { productId: 2, quantity: 4 }];
      const idList = soldProducts.map((product) => product.productId);

      sinon.stub(connection, 'query').resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
      
      expect(await salesService.add(soldProducts)).to.be.an('object')
        .that.deep.equals({ id: insertId, itemsSold: soldProducts });
    });

    it('otherwise it throws a "Product not found" error.', async () => {
      const soldProducts = [{ productId: 9999, quantity: 10 }, { productId: 2, quantity: 4 }];
      const idList = soldProducts.map((product) => product.productId);

      sinon.stub(connection, 'query').resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
      sinon.stub(connection, 'execute').resolves([mocks.resultSetHeader, undefined]);
        
      await expect(salesService.add(soldProducts))
        .to.be.rejectedWith(expressError.productNotFound.message);
    });
  });

  describe('Tests the edit function.', () => {
    it('If the sale is successfully added, it returns the edited sale.', async () => {
      const editedSale = { saleId: 1, products: [{ productId: 1, quantity: 7 }] }
      const idList = editedSale.products.map((product) => product.productId);

      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(editedSale.saleId), undefined]);
      sinon.stub(connection, 'query')
        .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
        
      expect(await salesService.edit(editedSale)).to.be.an('object')
        .that.deep.equals({ saleId: editedSale.saleId, itemsUpdated: editedSale.products });
    });

    it('If sale id doens\'t exist it throws a "Sale not found" error.', async () => {
      const editedSale = { saleId: 999, products: [{ productId: 1, quantity: 7 }] };
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(editedSale.saleId), undefined]);
      await expect(salesService.edit(editedSale))
        .to.be.rejectedWith(expressError.saleNotFound.message);
    });

    it('If a product if doesn\'t exist it throws a "Product not found" error.', async () => {
      const editedSale = { saleId: 1, products: [{ productId: 999, quantity: 7 }] }
      const idList = editedSale.products.map((product) => product.productId);

      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(editedSale.saleId), undefined]);
      sinon.stub(connection, 'query')
        .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
        
      await expect(salesService.edit(editedSale))
        .to.be.rejectedWith(expressError.productNotFound.message);
    });
  });

  describe('Tests the remove function.', () => {
    it('If a sale is removed it returns undefined.', async () => {
      const saleId = 1;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), undefined]);
      expect(await salesService.remove(saleId)).to.equal(undefined);
    });

    it('If sale id doesn\'t exist it throws a "Sale not found" error.', async () => {
      const saleId = 9999;
      sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), undefined]);
      await expect(salesService.remove(saleId))
        .to.be.rejectedWith(expressError.saleNotFound.message);
    });
  });
});
