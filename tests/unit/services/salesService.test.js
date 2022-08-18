const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesService = require('../../../services/salesService');
const mocks = require('../../mocks/queriesMocks');

const expressError = require('../../../utilities/expressError');

describe('Running all tests for the salesService file.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there are no sales registered', () => {
      before(() => sinon.stub(connection, 'execute').resolves([[], []]));
      after(() => connection.execute.restore());

      it('it returns an empty array', async () => {
        const salesList = await salesService.getAll();
        expect(salesList).to.be.an('array').that.is.empty;
      });
    });
  
    describe('When there are sales registered', () => {
      before(() => {
        sinon.stub(connection, 'execute')
          .onFirstCall().resolves([mocks.selectAllSales(), []])
          .resolves([mocks.selectAllSalesProducts(), []]);
      });
      after(() => connection.execute.restore());

      it('it returns an array of objects containing the properties "saleId", "productId", "quantity" and "date".', async () => {
        const salesList = await salesService.getAll();
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

      it('it throws a "Sale not found" error.', async () => {
        try {
          await salesService.getById(saleId);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.saleNotFound);
        }
      });
    });
  
    describe('When there is a sale with the provided id', () => {
      const saleId = 1;

      before(() => sinon.stub(connection, 'execute')
        .onFirstCall().resolves([mocks.selectSaleWhereIdEquals(saleId), []])
        .resolves([mocks.selectSalesProductsWhereSaleIdEquals(saleId), []]));
      after(() => connection.execute.restore());

      it('it returns an array of objects with the properties "productId", "quantity" and "date".', async () => {
        const sales = await salesService.getById(saleId);
        expect(sales).to.be.an('array').that.is.not.empty;
        sales.forEach((sale) => expect(sale).to.be.an('object').that.includes.all.keys('productId', 'quantity', 'date'));          
      });
    });
  });

  describe('Tests the add function.', () => {
    describe('When a sale is registered', () => {
      const { insertId } = mocks.resultSetHeader;
      const soldProducts = [{ productId: 1, quantity: 10 }, { productId: 2, quantity: 4 }];
      const idList = soldProducts.map((product) => product.productId);

      before(() => {
        sinon.stub(connection, 'query')
          .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
        sinon.stub(connection, 'execute')
          .resolves([mocks.resultSetHeader, undefined])});
      after(() => {
        connection.query.restore();
        connection.execute.restore();
      });

      it('it returns an object containg the registered sale.', async () => {
        const addedSale = await salesService.add(soldProducts);
        expect(addedSale).to.be.an('object').that.deep.equals({ id: insertId, itemsSold: soldProducts });
      });
    });

    describe('When a sale with nonexistent products is registered', () => {
      const { insertId } = mocks.resultSetHeader;
      const soldProducts = [{ productId: 9999, quantity: 10 }, { productId: 2, quantity: 4 }];
      const idList = soldProducts.map((product) => product.productId);

      before(() => {
        sinon.stub(connection, 'query')
          .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
        sinon.stub(connection, 'execute')
          .resolves([mocks.resultSetHeader, undefined])});
      after(() => {
        connection.query.restore();
        connection.execute.restore();
      });

      it('it throws a "Product not found" error.', async () => {
        try {
          await salesService.add(soldProducts);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.productNotFound);
        }
      });
    });
  });

  describe('Tests the edit function.', () => {
    describe('When a sale with a nonexistent id is passed', () => {
      const editedSale = { saleId: 999, products: [{ productId: 1, quantity: 7 }] }
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(editedSale.saleId), undefined]));
      after(() => connection.execute.restore());

      it('it throws a "Sale not found" error.', async () => {
        try {
          await salesService.edit(editedSale);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.saleNotFound);          
        }
      });
    });

    describe('When a product with an unregistered id is passed within the sale', () => {
      const editedSale = { saleId: 1, products: [{ productId: 999, quantity: 7 }] }
      const idList = editedSale.products.map((product) => product.productId);
      
      before(() => {
        sinon.stub(connection, 'execute')
          .resolves([mocks.selectSaleWhereIdEquals(editedSale.saleId), undefined]);
        sinon.stub(connection, 'query')
          .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
      });
      after(() => {
        connection.execute.restore();
        connection.query.restore();
      });

      it('it throws a "Product not found" error.', async () => {
        try {
          await salesService.edit(editedSale);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.productNotFound);          
        }
      });
    });

    describe('When a sale is successfully edited', () => {
      const editedSale = { saleId: 1, products: [{ productId: 1, quantity: 7 }] }
      const idList = editedSale.products.map((product) => product.productId);
      
      before(() => {
        sinon.stub(connection, 'execute')
          .resolves([mocks.selectSaleWhereIdEquals(editedSale.saleId), undefined]);
        sinon.stub(connection, 'query')
          .resolves([mocks.selectCountProductsWhereIdIn(idList), []]);
      });
      after(() => {
        connection.execute.restore();
        connection.query.restore();
      });

      it('it returns the edited sale.', async () => {
        const returnedSale = await salesService.edit(editedSale)
        expect(returnedSale).to.be.an('object')
          .that.deep.equals({ saleId: editedSale.saleId, itemsUpdated: editedSale.products });
      });
    });
  });

  describe('Tests the remove function.', () => {
    describe('When an existing sale id is passed', () => {
      const saleId = 1;
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), undefined]));
      after(() => connection.execute.restore());

      it('it returns undefined.', async () => {
        const returnedProduct = await salesService.remove(saleId)
        expect(returnedProduct).to.equal(undefined);
      });
    });

    describe('When a nonexistent sale id is passed', () => {
      const saleId = 9999;
      
      before(() => sinon.stub(connection, 'execute')
        .resolves([mocks.selectSaleWhereIdEquals(saleId), undefined]));
      after(() => connection.execute.restore());
      
      it('it throws a "Sale not found" error.', async () => {
        try {
          await salesService.remove(saleId);
        } catch (error) {
          expect(error).to.be.an('object').that.deep.equals(expressError.saleNotFound);
        }
      });
    });
  });
});
