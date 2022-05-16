const sinon = require('sinon');
const { expect } = require('chai');
const productsModel = require('../../models/productsModel');
const productsService = require('../../services/productsService');

describe('Testa o método getAll da camada services - Products', () => {
  describe('Quando não existe nenhum produto cadastrado', () => {
    const resultExecute = [[]];
    beforeEach(() => {
      sinon.stub(productsModel, 'getAll')
      .resolves(resultExecute);
    });
    afterEach(() => {
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
    beforeEach(() => {
      sinon.stub(productsModel, 'getAll')
      .resolves([{id: 2, name: 'xablau', quantity: 15}]);
    });
    afterEach(() => {
      productsModel.getAll.restore();
    });
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
      expect(result[0]).to.be.includes.all.keys('id', 'name', 'quantity');
    });
  });
});

describe('Testa o método getById da camada services - Products', () => {
  describe('Quando não existem produtos cadastrados', () => {
    beforeEach(() => {
      sinon.stub(productsModel, 'getById')
      .resolves(null);
    });
    afterEach(() => {
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
  beforeEach(() => {
    sinon.stub(productsModel, 'getById')
    .resolves(resultExecute);
  });
  afterEach(() => {
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

describe('Testa o método addProduct da camada services - Products', () => {
  describe('Quando já existe um produto com o name cadastrado', () => {
    const resultExecute = {
      id: 3,
      name: "Chinelo do Yang",
      quantity: 10,
    };
    beforeEach(() => {
      sinon.stub(productsModel, 'getByName')
      .resolves(resultExecute);
    });
    afterEach(() => {
      productsModel.getByName.restore();
    });
    it('Lança o erro status 409', async () => {
      try {
      await productsService.addProduct();
      } catch(err) {
        expect(err.status).to.be.equal(409);
      }
    });
    it('Lança a mensagem "Product" already exists', async () => {
      try {
        await productsService.addProduct();
      } catch(err) {
        expect(err.message).to.be.equal('Product already exists')
      }
    });
  });
  describe('Quando o produto é cadastrado corretamente', () => {
    const resultExecute = {id: 5, name: 'Chinelão do Yang', quantity: 15};
    beforeEach(() => {
      sinon.stub(productsModel, 'addProduct').resolves(resultExecute);
      sinon.stub(productsModel, 'getByName').resolves(null);
    });
    afterEach(() => {
      productsModel.addProduct.restore();
      productsModel.getByName.restore();
    });
    it('Retorna o objeto que foi adicionado no banco de dados', async () => {
      const result = await productsService.addProduct();
      expect(result).to.be.equal(resultExecute);
     });
  })
});

describe('Testa o método updateProduct da camada services - Products', () => {
  describe('Caso o produto cadastrado não exista', () => {
    beforeEach(() => {
      sinon.stub(productsModel, 'getById')
      .resolves(null);
    });
    afterEach(() => {
      productsModel.getById.restore();
    });
  it('Lança erro status 404 com a mensagem "Product not found"', async () => {
    try {
      await productsService.updateProduct({id: 1, name: 'Xablau', quantity: 15});
    } catch(err) {
      expect(err.status).to.be.equal(404);
      expect(err.message).to.be.equal("Product not found");
    }
  });
  });
  describe('Caso o produto seja cadastrado corretamente', () => {
    const resultDB = {id: 5, name: 'Chinelão do Yang', quantity: 15};
    beforeEach(() => {
      sinon.stub(productsModel, 'getById')
      .resolves(resultDB);
      sinon.stub(productsModel, 'updateProduct')
      .resolves(resultDB);
    });
    afterEach(() => {
      productsModel.getById.restore();
      productsModel.updateProduct.restore();
    });
    it('Retorna o objeto que foi cadastrado', async () => {
      const result = await productsService.updateProduct(1, 'Chinelão do Yang', 15);
      expect(result).to.be.equal(resultDB);
    });
  });
});

describe('Testa o método deleteProduct da camada services - Products', () => {
  describe('Caso o produto seja deletado corretamente', () => {
    const resultDB = {id: 5, name: 'Chinelão do Yang', quantity: 15};
    const id = 5;
    beforeEach(() => {
      sinon.stub(productsModel, 'getById')
      .resolves(resultDB);
      sinon.stub(productsModel, 'deleteProduct')
      .resolves({ status: 204 });
    });
    afterEach(() => {
      productsModel.getById.restore()
      productsModel.deleteProduct.restore()
    });
    it('Retorna o status 204, sem nenhum body', async () => {
      const result = await productsService.deleteProduct(id);
      expect(result.status).to.be.equal(204);
      expect(result.body).to.be.equal(undefined);
    });
  });
  describe('Caso o produto não seja encontrado', () => {
    const id = 5;
    beforeEach(() => {
      sinon.stub(productsModel, 'getById')
      .resolves(null);
    });
    afterEach(() => {
      productsModel.getById.restore();
    });
    it('Envia um erro status 404 e a mensagem "Product not found"', async () => {
      try {
        await productsService.deleteProduct(id);
      } catch(err) {
        expect(err.status).to.be.equal(404);
        expect(err.message).to.be.equal('Product not found');
      };
    });
  });
});