const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../models/connection');
const salesModel = require('../../models/salesModel');

describe('Busca todas as vendas no BD', () => {
  describe('Quando não existe nenhuma venda cadastrada', () => {
    const resultExecute = [[]];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(resultExecute);
    });
    after(() => {
      connection.execute.restore();
    });
    it('Retorna um array', async () => {
      const result = await salesModel.getAll();
      expect(result).to.be.an('array');
    });
    it('O array está vazio', async () => {
      const result = await salesModel.getAll();
      expect(result).to.be.empty;
    });
  });
  describe('Quando existem vendas cadastradas', () => {
    it('Retorna um array', async () => {
      const result = await salesModel.getAll();
      expect(result).to.be.an('array');
    })
    it('O array não está vazio', async () => { 
      const result = await salesModel.getAll();
      expect(result).to.be.not.empty;
    });
    it('O array possui objetos', async () => { 
      const [result] = await salesModel.getAll();
      expect(result).to.be.an('object');
    });
    it('O objeto que está no array possui os atributos saleId, date, productId e quantity', async () => {
      const [result] = await salesModel.getAll();
      expect(result).to.be.includes.all.keys('saleId', 'date', 'productId', 'quantity');
    });
  });
});

describe('Busca produto por id', () => {
  describe('Quando não existem produtos cadastrados', () => {
    const resultExecute = [[]];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(resultExecute);
    });
    after(() => {
      connection.execute.restore();
    });
    it('Retorna um array', async () => {
      const result = await salesModel.getById();
      expect(result).to.be.an('array');
    });
    it('O array está vazio', async () => {
      const result = await salesModel.getById();
      expect(result).to.be.empty;
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    const resultExecute = [[{
    id: 2,
    date: '2022-05-09 16:08:53'
  }]];
  before(() => {
    sinon.stub(connection, 'execute')
    .resolves(resultExecute);
  });
  after(() => {
    connection.execute.restore();
  });
    it('Retorna um array', async () => {
      const result = await salesModel.getById();
      expect(result).to.be.an('array');
    });
    it('O objeto que está no array possui os atributos date, productId e quantity', async () => {
      const [result] = await salesModel.getAll();
      expect(result).to.be.includes.all.keys('date', 'productId', 'quantity');
    });
  });
});

