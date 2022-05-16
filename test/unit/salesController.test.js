const sinon = require('sinon');
const { expect } = require('chai');

const salesController = require('../../controllers/salesController');
const salesService = require('../../services/salesService');

describe('Chamada do controller getAll - Sales', () => {
  describe('Quando não existem vendas cadastradas', () => {
    const request = {};
    const response = {};
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(salesService, 'getAll').resolves([]);
    });
    afterEach(() => {
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
    beforeEach(() => {
      request.body = {};
      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(salesService, 'getAll')
        .resolves(salesMock);
    });
    afterEach(() => {
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
  beforeEach(() => {
    request.body = {};
    response.status = sinon.stub()
      .returns(response);
    response.json = sinon.stub()
      .returns();
    sinon.stub(salesService, 'getById')
      .resolves(salesMock);
  });
  afterEach(() => {
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
   beforeEach(() => {
     response.status = sinon.stub().returns(response);
     response.json = sinon.stub().returns();
     sinon.stub(salesService, 'getById').throws(errorObj);
   });
   afterEach(() => {
     salesService.getById.restore();
   });
   it('Retorna status code 404 e a mensagem "Sale not found"', async () => { 
     await salesController.getById(request, response, next);
     expect(next.calledWith(errorObj)).to.be.equal(true);
   });
 }) 
});

describe('Chamada do controller addSale - Sales', () => {
  describe('Quando a venda é cadastrada com sucesso', () => {
    const request = {body: [{ productId: 5, quantity: 15 }]};
    const response = {};
    const addSaleReturn = {id: 5, itemsSold: [{productId: 3, quantity: 10}]};
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(salesService, 'addSale')
      .resolves(addSaleReturn);
    });
    afterEach(() => {
      salesService.addSale.restore();
    });
    it('Retorna o status 201', async () => {
      await salesController.addSale(request, response);
      expect(response.status.calledWith(201)).to.be.equal(true);
    });
    it('Retorna um json com um objeto', async () => {
      await salesController.addSale(request, response);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  })
});

describe('Chamada do controller updateSale - Sales', () => {
  describe('Quando a venda é cadastrada com sucesso', () => {
    const request = {body: [{ productId: 5, quantity: 15 }], params: {id: 2}};
    const response = {};
    const updateSaleReturn = {saleId: 5, itemUpdated: [{productId: 3, quantity: 10}]};
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(salesService, 'updateSale')
      .resolves(updateSaleReturn);
    });
    afterEach(() => {
      salesService.updateSale.restore();
    });
    it('Retorna o status 200', async () => {
      await salesController.updateSale(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });
    it('Retorna um json com um objeto', async () => {
      await salesController.updateSale(request, response);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });
  })
});

describe('Controller deleteSale - Sales', () => {
  describe('Quando a deleção é realizada com sucesso', () => {
    const request = {params: {id: 1}};
    const response = {};
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.send = sinon.stub().returns();
      sinon.stub(salesService, 'deleteSale')
      .resolves({status: 204});
    });
    afterEach(() => {
      salesService.deleteSale.restore();
    });
    it('Retorna o status 204', async () => {
      await salesController.deleteSale(request, response);
      expect(response.status.calledWith(204)).to.be.equal(true);
    });
  });
  describe('Quando a venda não existe no BD', () => {
    const request = {params: {id: 1}};
    const response = {};
    const next = sinon.stub().returns();
    beforeEach(() => {
      response.status = sinon.stub().returns(response);
      response.send = sinon.stub().returns();
      sinon.stub(salesService, 'deleteSale')
      .throws({status: 404, message: 'Sale not found'});
    });
    afterEach(() => {
      salesService.deleteSale.restore();
    });
    it('Verifica se o next é chamado com os parâmetros status: 204 e message: "Sale not found"', async () => {
      await salesController.deleteSale(request, response, next);
      expect(next.calledWith({status: 404, message: 'Sale not found'})).to.be.equal(true);
    });
  })
})