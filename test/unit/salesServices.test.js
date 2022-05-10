const sinon = require('sinon');
const { expect } = require('chai');
const salesModel = require('../../models/salesModel');
const salesService = require('../../services/salesService');

describe('Testa o método getAll da camada services - Sales', () => {
  describe('Quando não existe nenhum produto cadastrado', () => {
    const resultExecute = [[]];
    before(() => {
      sinon.stub(salesModel, 'getAll')
      .resolves(resultExecute);
    });
    after(() => {
      salesModel.getAll.restore();
    });
    it('Retorna um array', async () => {
      const result = await salesService.getAll();
      expect(result).to.be.an('array');
    });
    it('O array está vazio', async () => {
      const [result] = await salesService.getAll();
      expect(result).to.be.empty;
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    it('Retorna um array', async () => {
      const result = await salesService.getAll();
      expect(result).to.be.an('array');
    })
    it('O array não está vazio', async () => { 
      const result = await salesService.getAll();
      expect(result).to.be.not.empty;
    });
    it('O array possui objetos', async () => { 
      const [result] = await salesService.getAll();
      expect(result).to.be.an('object');
    });
    it('O objeto que está no array possui os atributos saleId, date, productId e quantity', async () => {
      const [result] = await salesService.getAll();
      expect(result).to.be.includes.all.keys('saleId', 'date', 'productId', 'quantity');
    });
  });
});
describe('Testa o método getById da camada services - Sales', () => {
  describe('Quando não existem vendas cadastradas', () => {
    before(() => {
      sinon.stub(salesModel, 'getById')
      .resolves([]);
    });
    after(() => {
      salesModel.getById.restore();
    });
    it('Envia o erro de status 404', async () => {
      try {
        await salesService.getById();
      } catch(err) {
        expect(err.status).to.be.equal(404)
      }
    });
    it('Retorna a mensagem "Sale not found"', async () => {
      try {
      await salesService.getById();
      } catch(err) {
        expect(err.message).to.be.equal('Sale not found');
      }
    });
  });
  describe('Quando existem vendas cadastradas', () => {
    const resultExecute = [
      [ { date: '2022-05-11T01:15:55.000Z', productId: 3, quantity: 15 } 
    ]
  ];
  before(() => {
    sinon.stub(salesModel, 'getById')
    .resolves(resultExecute);
  });
  after(() => {
    salesModel.getById.restore();
  });
    it('Retorna uma array', async () => {
      const result = await salesService.getById();
      expect(result).to.be.an('array');
    });
    it('Retorna um objeto com as chaves date, productId e quantity', async () => {
      const [result] = await salesService.getById();   
      expect(result[0]).to.be.includes.keys('date', 'productId', 'quantity');
    });
  });
});