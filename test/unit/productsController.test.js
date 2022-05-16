const sinon = require('sinon');
const { expect } = require('chai');

const productsController = require('../../controllers/productsController');
const productsService = require('../../services/productsService');

describe('Chamada do controller getAll Products', () => {
  describe('Quando não existem produtos cadastrados', () => {
    const request = {};
    const response = {};
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(productsService, 'getAll').resolves([]);
    });
    afterEach(() => {
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
    beforeEach(() => {
      request.body = {};
      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'getAll')
        .resolves(productsMock);
    });
    afterEach(() => {
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
   beforeEach(() => {
     request.body = {};
     response.status = sinon.stub()
       .returns(response);
     response.json = sinon.stub()
       .returns();
     sinon.stub(productsService, 'getById')
       .resolves(productsMock);
   });
   afterEach(() => {
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
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'getById').throws(errorObj);
    });
    afterEach(() => {
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
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'addProduct').throws(errorMessage);
    });
    afterEach(() => {
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
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'addProduct')
      .resolves(responseObj);
    });
    afterEach(() => {
      productsService.addProduct.restore();
    })
    it('Retorna um objeto JSON com o status 201', async () => {
      await productsController.addProduct(request, response);
      expect(response.status.calledWith(201)).to.equal(true);
    });
  })
});

describe('Testa o método updateProduct da camada controller - Products', () => {
  describe('Caso não exista um produto com o id cadastrado', () => {
    const request = {params: {id: 5}, body: {name:"Chinelo", quantity: 15}};
    const errorObject = {status: 404, message: "Product not found"};
    const response = {};
    const next = sinon.stub().resolves();
    beforeEach(() => {
      sinon.stub(productsService, 'updateProduct')
      .throws(errorObject);
    });
    afterEach(() => {
      productsService.updateProduct.restore();
    });
    it('A função next é chamada com os parâmetros status 404 e a mensagem "Product" not found', async () => {
      await productsController.updateProduct(request, response, next);
      expect(next.calledWith(errorObject)).to.be.equal(true);
    });
  });
  describe('Caso o produto seja cadastrado corretamente', () => {
    const request = {params: {id: 5}, body: {name: 'Chinelo do Yang', quantity: 15}};
    const response = {};
    const returnObj = {id: 5, name: 'Chinelo do Yang', quantity: 15};
    const next = sinon.stub().resolves();
    beforeEach(() => {
      sinon.stub(productsService, 'updateProduct')
      .resolves(returnObj);
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });
    afterEach(() => {
      productsService.updateProduct.restore();
    })
    it('Retorna o status 200 e o objeto atualizado', async () => {
      await productsController.updateProduct(request, response, next);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(returnObj)).to.be.equal(true);
    });
  })
});

describe('Testa o método deleteProduct da camada controller - Products', () => {
  describe('Quando o produto é deletado com sucesso', () => {
    const request = {params: {id: 5}};
    const response = {};
    const next = sinon.stub().resolves();
    beforeEach(() => {
      sinon.stub(productsService, 'deleteProduct')
      .resolves({status: 204});
      response.status = sinon.stub().returns(response);
    });
    afterEach(() => {
      productsService.deleteProduct.restore();
    });
    it('Retorna o status 204', async () => {
      await productsController.deleteProduct(request, response, next);
      expect(response.status.calledWith(204)).to.be.equal(true);
    });
  });
  describe('Quando o produto não é deletado', () => {
    const request = {params: {id: 5}};
    const response = {};
    const next = sinon.stub().resolves();
    const errorObj = {status: 404, message: "Product not found"};
    beforeEach(() => {
      response.status = sinon.stub().resolves(response);
      sinon.stub(productsService, 'deleteProduct')
      .throws(errorObj);
    });
    afterEach(() => {
      productsService.deleteProduct.restore();
    });
    it('A função next é chamada com os parâmetros status 404 e message "Product not found"', async () => {
      await productsController.deleteProduct(request, response, next);
      expect(next.calledWith(errorObj)).to.be.equal(true)
    });
  });
});