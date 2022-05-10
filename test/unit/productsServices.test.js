const sinon = require('sinon');
const { expect } = require('chai');
const productsModel = require('../../models/productsModel');
const productsService = require('../../services/productsService');

describe('Testa o método getAll da camada services - Products', () => {
  describe('Quando não existe nenhum produto cadastrado', () => {
    const resultExecute = [[]];
    before(() => {
      sinon.stub(productsModel, 'getAll')
      .resolves(resultExecute);
    });
    after(() => {
      productsModel.getAll.restore();
    });
    it('Retorna um array', async () => {
      const result = await productsService.getAll();
      expect(result).to.be.an('array');
    });
    it('O array está vazio', async () => {
      const [result] = await productsService.getAll();
      expect(result).to.be.empty;
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    it('Retorna um array', async () => {
      const result = await productsService.getAll();
      expect(result).to.be.an('array');
    })
    it('O array não está vazio', async () => { 
      const result = await productsService.getAll();
      expect(result).to.be.not.empty;
    });
    it('O array possui objetos', async () => { 
      const [result] = await productsService.getAll();
      expect(result).to.be.an('object');
    });
    it('O objeto que está no array possui os atributos id, name e quantity', async () => {
      const result = await productsService.getAll();
      expect(result[1]).to.be.includes.all.keys('id', 'name', 'quantity');
    });
  });
});
describe('Testa o método getById da camada services - Products', () => {
  describe('Quando não existem produtos cadastrados', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
      .resolves(null);
    });
    after(() => {
      productsModel.getById.restore();
    });
    it('Envia o erro de status 400', async () => {
      try {
        await productsService.getById();
      } catch(err) {
        expect(err.status).to.be.equal(404)
      }
    });
    it('Retorna a mensagem "Product not found"', async () => {
      try {
      await productsService.getById();
      } catch(err) {
        expect(err.message).to.be.equal('Product not found');
      }
    });
  });
  describe('Quando existem produtos cadastrados', () => {
    const resultExecute = [[{
    id: 2,
    name: 'Traje de encolhimento',
    quantity: 20,
  }]];
  before(() => {
    sinon.stub(productsModel, 'getById')
    .resolves(resultExecute);
  });
  after(() => {
    productsModel.getById.restore();
  });
    it('Retorna um objeto', async () => {
      const [result] = await productsService.getById();
      expect(result[0]).to.be.an('object');
    });
    it('Retorna um objeto com as chaves id, name e quantity', async () => {
      const [result] = await productsService.getById();      
      expect(result[0]).to.be.includes.keys('id', 'name', 'quantity');
    });

  });
});

