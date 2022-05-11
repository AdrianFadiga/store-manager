const sinon = require('sinon');
const { expect } = require('chai');

const salesController = require('../../controllers/salesController');
const salesService = require('../../services/salesService');

describe('Chamada do controller getAll - Sales', () => {
  describe('Quando não existem vendas cadastradas', () => {
    const request = {};
    const response = {};
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(salesService, 'getAll').resolves([]);
    });
    after(() => {
      salesService.getAll.restore();
    });
    it('é retornado o método status passando o código 200', async () => {
      await salesController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });
    it('é retornado o método json contendo um array', async () => {
      await salesController.getAll(request, response);
      expect(response.json.calledWith(sinon.match.array)).to.be.equal(true);
    });
  });
  describe('Quando existem vendas cadastradas', () => {
    const salesMock = [
      {
        "saleId": 1,
        "date": "2022-05-11T01:15:55.000Z",
        "productId": 1,
        "quantity": 5
      },
      {
        "saleId": 1,
        "date": "2022-05-11T01:15:55.000Z",
        "productId": 2,
        "quantity": 10
      },
      {
        "saleId": 2,
        "date": "2022-05-11T01:15:55.000Z",
        "productId": 3,
        "quantity": 15
      }
    ]
    const response = {};
    const request = {};
    before(() => {
      request.body = {};
      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(salesService, 'getAll')
        .resolves(salesMock);
    });
    after(() => {
      salesService.getAll.restore();
    });
    it('É retornado o método status com o código 200', async () => {
      await salesController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });
    it('É retornado o método json contendo um array', async () => {
      await salesController.getAll(request, response);
      expect(response.json.calledWith(sinon.match.array)).to.be.equal(true);
    });
  });
});

describe('Chamada do controller getById - Sales', () => {
 describe('Quando encontra a venda com o id', () => {
   const request = {
     params: 1,
   };
   const response = {};
   const salesMock = [
    {
      "date": "2022-05-11T09:04:48.000Z",
      "productId": 1,
      "quantity": 5
    },
    {
      "date": "2022-05-11T09:04:48.000Z",
      "productId": 2,
      "quantity": 10
    }
  ];
  before(() => {
    request.body = {};
    response.status = sinon.stub()
      .returns(response);
    response.json = sinon.stub()
      .returns();
    sinon.stub(salesService, 'getById')
      .resolves(salesMock);
  });
  after(() => {
    salesService.getById.restore();
  });
   it('Retorna status code 200', async () => {
     await salesController.getById(request, response);
     expect(response.status.calledWith(200)).to.equal(true);
   });
   it('Retorna um json contendo um array', async () => {
     await salesController.getById(request, response);
     expect(response.json.calledWith(sinon.match.array)).to.be.equal(true);
   });
 });
 describe('Quando não encontra a venda com o id', () => {
   const request = {params: 999};
   const response = {};
   const errorObj = {status: 404, message: "Sale not found"};
   const next = sinon.stub().returns();
   before(() => {
     response.status = sinon.stub().returns(response);
     response.json = sinon.stub().returns();
     sinon.stub(salesService, 'getById').throws(errorObj);
   });
   after(() => {
     salesService.getById.restore();
   });
   it('Retorna status code 404', async () => { 
     await salesController.getById(request, response, next);
     expect(next.calledWith(errorObj)).to.be.equal(true);
   });
   it('Retorna um json contendo a mensagem "Sale not found"', async () => { })
 }) 
})
describe('Chamada do controller addSale - Sales', () => {
  describe('Quando a requisição é feita sem o atribuito quantity', () => {
    const request = {
      body: {
        productId: 1
      }
    };
    const response = {};
    const next = sinon.stub().returns();
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(salesService, 'addSale').throws({status: 400, message: '"quantity" is required'})
    });
    after(() => {
      salesService.addSale.restore();
    })
    it('Retorna o status 400 com a mensagem "quantity" is required', async () => {
      await salesController.addSale(request, response, next);
      expect(next.calledWith({status: 400, message: '"quantity" is required'})).to.be.equal(true);        
    });
  });
  describe('Quando a requisição é feita sem o atribuito productId', () => {
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
      sinon.stub(salesService, 'addSale').throws({status: 400, message: '"productId" is required'})
    });
    after(() => {
      salesService.addSale.restore();
    })
    it('Retorna o status 400 com a mensagem "productId" is required', async () => { 
      await salesController.addSale(request, response, next);
      expect(next.calledWith({status: 400, message: '"productId" is required'})).to.be.equal(true);
    });
  });
  describe('Quando a requisição é feita com o quantity menor ou igual a 0', () => {
    const request = {
      body: {
        productId: 1,
        quantity: -1,
      }
    };
    const response = {};
    const next = sinon.stub().returns();
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(salesService, 'addSale').throws({status: 422, message: '"quantity" must be greater than or equal to 1'})
    });
    after(() => {
      salesService.addSale.restore();
    });
    it('Retorna erro com status 422 e a mensagem "quantity" must be greater than or equal to 1', async () => {
      await salesController.addSale(request, response, next);
      expect(next.calledWith({status: 422, message: '"quantity" must be greater than or equal to 1'})).to.be.equal(true);
    });
  })
});