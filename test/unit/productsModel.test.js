const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../models/connection');
const productsModel = require('../../models/productsModel');

describe('Busca todos os produtos no BD', () => {
  describe('Quando não existe nenhum produto cadastrado', () => {
    const resultExecute = [[]];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(resultExecute);
    });
    after(() => {
      connection.execute.restore();
    });
    it('Retorna um array', async () => {
      const result = await productsModel.getAll();
      expect(result).to.be.an('array');
    });
    it('O array está vazio', async () => {
      const result = await productsModel.getAll();
      expect(result).to.be.empty;
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    it('Retorna um array', async () => {
      const result = await productsModel.getAll();
      expect(result).to.be.an('array');
    })
    it('O array não está vazio', async () => { 
      const result = await productsModel.getAll();
      expect(result).to.be.not.empty;
    });
    it('O array possui objetos', async () => { 
      const [result] = await productsModel.getAll();
      expect(result).to.be.an('object');
    });
    it('O objeto que está no array possui os atributos id, name e quantity', async () => {
      const [result] = await productsModel.getAll();
      expect(result).to.be.includes.all.keys('id', 'name', 'quantity');
    });
  });
});

describe('Busca produto por id', () => {
  describe('Quando não existem produtos cadastrados', () => {
    const resultExecute = [[{}]];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(resultExecute);
    });
    after(() => {
      connection.execute.restore();
    });
    it('Retorna um object', async () => {
      const result = await productsModel.getById();
      expect(result).to.be.an('object');
    });
    it('O objeto está vazio', async () => {
      const result = await productsModel.getById();
      expect(result).to.be.empty;
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    const resultExecute = [[{
    id: 2,
    name: 'Traje de encolhimento',
    quantity: 20,
  }]];
  before(() => {
    sinon.stub(connection, 'execute')
    .resolves(resultExecute);
  });
  after(() => {
    connection.execute.restore();
  });
    it('Retorna um objeto', async () => {
      const result = await productsModel.getById();
      expect(result).to.be.an('object');
    });
    it('Retorna um objeto com as chaves id, name e quantity', async () => {
      const result = await productsModel.getById();
      expect(result).to.be.includes.keys('id', 'name', 'quantity');
    });

  });
  describe('Retorna null quando não existe produto com o id', () => {
    const resultExecute = [];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(resultExecute);
    });
    after(() => {
      connection.execute.restore();
    })    
      it('Retorna null caso não exista um produto com o determinado id', async () => {
        const result = await productsModel.getById();
        expect(result).to.be.equal(null);
      })
  });
});

