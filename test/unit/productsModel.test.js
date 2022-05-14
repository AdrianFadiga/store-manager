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
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves([[{id: 2, name: 'xablau', quantity: 15}]]);
    });
    after(() => {
      connection.execute.restore();
    });
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
});

describe('Testa o método getByName da camada models - products', () => {
  describe('Caso encontre o produto pelo nome no DB', () => {
    const resultExecute = [[{id: 3, name: "Chinelão do Yang", quantity: 15}]];
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves(resultExecute);
    });
    after(() => {
      connection.execute.restore();
    });
    it('Verifica se retorna um objeto', async () => {
      const result = await productsModel.getByName();
      expect(result).to.be.an('object');
    });
    it('Verifica se o objeto possui as chaves id, name e quantity', async () => {
      const result = await productsModel.getByName();
      expect(result).to.be.includes.keys('id', 'name', 'quantity');
    });
  });
});

describe('Testa o método addProduct da camada models - products', () => {
  describe('Caso o produto seja adicionado no banco de dados', () => {
    const name = 'Chinelão do Yang';
    const quantity = 15;
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves([{insertId: 5}]);
    });
    after(() => {
      connection.execute.restore();
    })
    it('Retorna um objeto', async () => {
      const result = await productsModel.addProduct(name, quantity);
      expect(result).to.be.an('object');
      });
    it('Retorna um objeto com as chaves id, name e quantity', async () => {
      const result = await productsModel.addProduct(name, quantity);
      expect(result).to.be.includes.keys('id', 'name', 'quantity');
    });
  });
});

describe('Testa o método updateProduct da camada models - Products', () => {
  describe('Quando existe um produto com o id solicitado', () => {    
    const objMock = { id: 4, name: 'Celular do Yang', quantity: 20 };
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves([[{id: 2, name: 'xablau', quantity: 15}]]);
    });
    after(() => {
      connection.execute.restore();
    });  
    it('Verifica se retorna o objeto com o produto atualizado', async () => {
      const result = await productsModel.updateProduct(objMock.id, objMock.name, objMock.quantity);
      expect(result).to.have.property('id', 4);
      expect(result).to.have.property('name', 'Celular do Yang');
      expect(result).to.have.property('quantity', 20);
    });
  });
});

describe('Testa o método deleteProduct da camada models - Products', () => {
  describe('Caso o produto seja deletado com sucesso', () => {
    const id = 1;
    before(() => {
      sinon.stub(connection, 'execute')
      .resolves([{affectedRows: 1}]);
    })
    after(() => {
      connection.execute.restore();
    })
    it('Retorna uma string com o valor "Deletado"', async () => {
      const result = await productsModel.deleteProduct(id);
      expect(result.status).to.be.equal(204);
    });
  })
})