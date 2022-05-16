const sinon = require('sinon');
const { expect } = require('chai');
const salesModel = require('../../models/salesModel');
const salesService = require('../../services/salesService');
const productsService = require('../../services/productsService');

describe('Testa o método getAll da camada services - Sales', () => {
  describe('Quando não existe nenhum produto cadastrado', () => {
    const resultExecute = [[]];
    beforeEach(() => {
      sinon.stub(salesModel, 'getAll')
      .resolves(resultExecute);
    });
    afterEach(() => {
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
    beforeEach(() => {
      sinon.stub(salesModel, 'getAll')
      .resolves([{saleId: 2, date: '22/02/2021', productId: 2, quantity: 15}]);
    });
    afterEach(() => {
      salesModel.getAll.restore();
    });
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
    beforeEach(() => {
      sinon.stub(salesModel, 'getById')
      .resolves([]);
    });
    afterEach(() => {
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
  beforeEach(() => {
    sinon.stub(salesModel, 'getById')
    .resolves(resultExecute);
  });
  afterEach(() => {
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

describe('Testa o método addSale da camada services - Sales', () => {
  describe('Quando a venda é cadastrada com sucesso', () => {
    const insertId = 1;
    const salesArray = [{productId: 1, quantity: 5}];
    const returnDb = {productId: 1, quantity: 65};
    beforeEach(() => {
      sinon.stub(salesModel, 'addDate').resolves(insertId);
      sinon.stub(salesModel, 'addSale').resolves(returnDb);
      sinon.stub(productsService, 'getById').resolves({ id: 1, name: 'Martelo de Thor', quantity: 50 })
    });
    afterEach(() => {
      salesModel.addDate.restore();
      salesModel.addSale.restore();
      productsService.getById.restore();
    });
    it('Retorna um objeto contendo as chaves id e itemsSold', async () => {
      const result = await salesService.addSale(salesArray);
      expect(result).to.have.keys('id', 'itemsSold');
    });
    it('A chave itemsSold é uma array', async () => {
      const {itemsSold} = await salesService.addSale(salesArray);
      expect(itemsSold).to.be.an('array');
    });
    it('Os objetos da array itemsSold possuem as chaves productId e quantity', async () => {
      const {itemsSold} = await salesService.addSale(salesArray);
      expect(itemsSold[0]).to.have.keys('productId', 'quantity');
    });
  });
});

describe('Testa o método updateSale da camada services - Sales', () => {
  const id = 2;
  const productId = 2;
  const quantity = 25;
  const returnDB = {id: 2, quantity: 20};
  beforeEach(() => {
    sinon.stub(salesModel, 'updateSale')
    .resolves(returnDB);
  });
  afterEach(() => {
    salesModel.updateSale.restore();
  });
  describe('Verifica o retorno da função', () => {
    it('Verifica se a função retorna um objeto', async () => {
      const result = await salesService.updateSale(id, productId, quantity);
      expect(result).to.be.an('object');
     });
    it('Verifica o objeto possui as chaves saleId e itemUpdated', async () => {
      const result = await salesService.updateSale(id, productId, quantity);
      expect(result).to.have.keys('saleId', 'itemUpdated');
     });
    it('Verifica se a chave itemUpdated é um array', async () => { 
      const {itemUpdated} = await salesService.updateSale(id, productId, quantity);
      expect(itemUpdated).to.be.an('array');
    });
    it('Verifica se itemUpdated é um array de objetos', async () => { 
      const {itemUpdated} = await salesService.updateSale(id, productId, quantity);
      expect(itemUpdated[0]).to.have.keys('productId', 'quantity');
    });
  })
});

describe('Testa o método deleteSale da camada services - Sales', () => {
  describe('Quando a venda é deletada com sucesso', () => {
    const id = 1;
    beforeEach(() => {
      sinon.stub(salesModel, 'deleteSale')
      .resolves({status: 204});
      sinon.stub(salesModel, 'getById')
      .resolves([{xablau: 'xablau'}]);
      sinon.stub(productsService, 'getById').resolves({ id: 1, name: 'Martelo de Thor', quantity: 50 })
    });
    afterEach(() => {
      salesModel.deleteSale.restore();
      salesModel.getById.restore();
      productsService.getById.restore();
    }); 
    it('Retorna um objeto {status: 204}', async () => {
      const result = await salesService.deleteSale(id);
      expect(result.status).to.be.equal(204);
    });
  });
  describe('Quando a venda com o id não é encontrado', () => {
    const id = 1;
    beforeEach(() => {
      sinon.stub(salesModel, 'deleteSale')
      .resolves({status: 204});
      sinon.stub(salesModel, 'getById')
      .resolves([]);
    });
    afterEach(() => {
      salesModel.deleteSale.restore();
      salesModel.getById.restore();
    }); 
    it('Lança um erro status 404 e a mensagem "Sale not found"', async () => {
      try {
        await salesService.deleteSale(id);
      } catch(err) {
        expect(err.status).to.be.equal(404);
        expect(err.message).to.be.equal('Sale not found');
      }
    })
  })
 });