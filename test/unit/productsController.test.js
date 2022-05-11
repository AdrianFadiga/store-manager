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

describe('Chamada do controller getById - Products', () => {
  describe('Quando encontra a venda com o id', () => {
    const request = {
      params: 1,
    };
    const response = {};
    const productsMock = {
      "id": 1,
      "name": "Martelo de Thor",
      "quantity": 10
    };
   before(() => {
     request.body = {};
     response.status = sinon.stub()
       .returns(response);
     response.json = sinon.stub()
       .returns();
     sinon.stub(productsService, 'getById')
       .resolves(productsMock);
   });
   after(() => {
     productsService.getById.restore();
   });
    it('Retorna status code 200', async () => {
      await productsController.getById(request, response);
      expect(response.status.calledWith(200)).to.equal(true);
    });
    it('Retorna um json contendo um objeto', async () => {
      await productsController.getById(request, response);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  });
  describe('Quando não encontra a venda com o id', () => {
    const request = {params: 999};
    const response = {};
    const errorObj = {status: 404, message: "Product not found"};
    const next = sinon.stub().returns();
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'getById').throws(errorObj);
    });
    after(() => {
      productsService.getById.restore();
    });
    it('Retorna status code 404 e a mensagem "Product not found"', async () => { 
      await productsController.getById(request, response, next);
      expect(next.calledWith(errorObj)).to.be.equal(true);
    });
  }) 
 });
 
describe('Testa o método addProduct da camada Controller - Products', () => {
  describe('Quando a requisição é feita com o atributo name já cadastrado', () => {
    const next = sinon.stub().returns();
    const errorMessage = {message: "Product already exists", status: 409}
    const request = {body: {name: 'Xablau', quantity: 15}};
    const response = {};
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'addProduct').throws(errorMessage);
    });
    after(() => {
      productsService.addProduct.restore();
    })
    it('Retorna um erro com a mensagem "Product already exists" e o status 409', async () => {
      await productsController.addProduct(request, response, next);
      expect(next.calledWith(errorMessage)).to.equal(true);
    });
  });
  describe('Quando a requisição é realizada com sucesso', () => {
    const request = {body: {name: "Chinelão do Yang", quantity: 15}};
    const response = {};
    const responseObj = {id: 3, name: "Chinelão do Yang", quantity: 15};
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'addProduct')
      .resolves(responseObj);
    });
    after(() => {
      productsService.addProduct.restore();
    })
    it('Retorna um objeto JSON com o status 201', async () => {
      await productsController.addProduct(request, response);
      expect(response.status.calledWith(201)).to.equal(true);
    });
  })
});