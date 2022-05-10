const sinon = require('sinon');
const { expect } = require('chai');

const productsController = require('../../controllers/productsController');
const productsService = require('../../services/productsService');

describe('Chamada do controller getAll Products', () => {
  describe('Quando não existem produtos cadastrados', () => {
    const request = {};
    const response = {};
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(productsService, 'getAll').resolves([]);
    });
    after(() => {
      productsService.getAll.restore();
    });
    it('é retornado o método status passando o código 200', async () => {
      await productsController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });
    it('é retornado o método json contendo um array', async () => {
      await productsController.getAll(request, response);
      expect(response.json.calledWith(sinon.match.array)).to.be.equal(true);
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    const productsMock = [{
      "id": 1,
      "name": "Martelo de Thor",
      "quantity": 10
    },
    {
      "id": 2,
      "name": "Traje de encolhimento",
      "quantity": 20
    },
    {
      "id": 3,
      "name": "Escudo do Capitão América",
      "quantity": 30
    }]
    const response = {};
    const request = {};
    before(() => {
      request.body = {};
      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'getAll')
        .resolves(productsMock);
    });
    after(() => {
      productsService.getAll.restore();
    });
    it('É retornado o método status com o código 200', async () => {
      await productsController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });
    it('É retornado o método json contendo um array', async () => {
      await productsController.getAll(request, response);
      expect(response.json.calledWith(sinon.match.array)).to.be.equal(true);
    });
  });
});
describe('Chamada do controller addProduct', () => {
  describe('Quando a requisição é feita sem o atribuito quantity', () => {
    const request = {
      body: {
        name: 'xablau'
      }
    };
    const response = {};
    const next = sinon.stub().returns();
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'addProduct').throws({status: 400, message: '"quantity" is required'})
    });
    after(() => {
      productsService.addProduct.restore();
    })
    it('Retorna o status 400', async () => {
      await productsController.addProduct(request, response, next);
      expect(next.calledWith({status: 400, message: '"quantity" is required'})).to.be.equal(true);        
    });
    it('Retonar a mensagem "quantity" is required', async () => {
      await productsController.addProduct(request, response, next);
      expect(next.calledWith({status: 400, message: '"quantity" is required'})).to.be.equal(true);
    });
  });
  describe('Quando a requisição é feita sem o atribuito name', () => {
    const request = {
      body: {
        quantity: 10,
      }
    }
    const response = {};
    const next = sinon.stub().returns();
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'addProduct').throws({status: 400, message: '"name" is required'})
    });
    after(() => {
      productsService.addProduct.restore();
    })
    it('Retorne o status 400', async () => { 
      await productsController.addProduct(request, response, next);
      expect(next.calledWith({status: 400, message: '"name" is required'})).to.be.equal(true);
    });
    it('Retorna a mensagem "name" is required', async () => {
      await productsController.addProduct(request, response, next);
      expect(next.calledWith({status: 400, message: '"name" is required'})).to.be.equal(true);
    });
  });
});