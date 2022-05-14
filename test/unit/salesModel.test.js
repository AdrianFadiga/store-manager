const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../models/connection');
const salesModel = require('../../models/salesModel');

describe('Testa a função getAll da camada model - Sales', () => {
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
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves([[{saleId: 2, date: '22/02/2022', productId: 3, quantity: 15}]]);
    });
    after(() => {
      connection.execute.restore();
    });
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

describe('Busca venda por id', () => {
  describe('Quando não existem vendas cadastradas', () => {
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
  describe('Quando existem vendas cadastradas', () => {
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

describe('Testa a função addDate da camada model - Sales', () => {
  describe('Verifica o insertId', () => {
    const returnDB = [{insertId: 5}];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(returnDB);
    });
    after(() => {
      connection.execute.restore();
    });
    it('Espera que o insertId seja do tipo number', async () => {
      const result = await salesModel.addDate();
      expect(typeof result).to.be.equal('number');
    });
  })
})

describe('Testa o método addSale da camada model - Sales', () => {
  describe('Quando a venda é cadastrada com sucesso', () => {
    const id = 1;
    const quantity = 3;
    const insertId = 5;
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves();
    });
    after(() => {
      connection.execute.restore();
    });
    it('Retorna um objeto contendo as chaves productId e quantity', async () => {
      const result = await salesModel.addSale(id, quantity, insertId);
      expect(result).to.have.keys('productId', 'quantity');
    });
  });
});

describe('Testa o método updateSale da camada model - Sales', () => {
  const resultDB = [{affectedRows: 2}];
  before(() => {
    sinon.stub(connection, 'execute')
    .resolves(resultDB);
  });
  after(() => {
    connection.execute.restore();
  });
  describe('Caso a venda seja atualizada com sucesso', () => {
    it('Retorna um objeto com as chaves productId e quantity', async () => {
      const result = await salesModel.updateSale();
      expect(result).to.have.keys('productId', 'quantity');
    });
  });
});

describe('Testa o método deleteSale da camada model - Sales', () => {
  const id = 2;
  before(() => {
    sinon.stub(connection, 'execute')
    .resolves();
  });
  after(() => {
    connection.execute.restore();
  });
  describe('Quando a venda é deletada com sucesso', () => {
    it('Retorna um objeto com o status 204', async () => {
      const {status} = await salesModel.deleteSale(id);
      expect(status).to.be.equal(204);
    });
  });
});