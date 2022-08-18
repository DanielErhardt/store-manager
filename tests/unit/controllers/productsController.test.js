const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const mocks = require('../../mocks/servicesMocks');
const testControllerFunction = require('../../../utilities/testControllerFunction');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');

describe('Running all tests for the productsController.', () => {
  describe('Tests the getAll function.', () => {
    describe('When there are products registered', () => {
      before(() => sinon.stub(productsService, 'getAll').resolves(mocks.getAllProducts()));
      after(() => sinon.restore());
      it('it responds with status 200 and a json containing all products.', async () => {
        const result = await testControllerFunction(productsController.getAll);
        console.log(result);
        expect(result.status).to.equal(200);
        expect(result.json).to.be.an('array').that.is.not.empty;
      });
    });
  });

  describe('When there are no products registered', () => {
    before(() => sinon.stub(productsService, 'getAll').resolves([]));
    after(() => sinon.restore());
    it('it responds with status 200 and a json containing an empty array.', async () => {
      const result = await testControllerFunction(productsController.getAll);
      console.log(result);
      expect(result.status).to.equal(200);
      expect(result.json).to.be.an('array').that.is.empty;
    });
  });
});
