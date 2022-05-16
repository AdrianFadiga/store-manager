const salesModel = require('../models/salesModel');
const productsService = require('./productsService');

const objGenerator = (message, status) => ({
  message,
  status,
});

const getUpdatedArray = async (saleArray, deleteSale) => {
  const getProductsByIdArray = await Promise.all(saleArray.map(({ productId }) => 
  productsService.getById(productId)));
  const updatedProductsArray = getProductsByIdArray.reduce((acc, curr, i) => {
    acc.push({ id: curr.id,
    name: curr.name,
    quantity: (deleteSale 
      ? curr.quantity + saleArray[i].quantity
      : curr.quantity - saleArray[i].quantity) });
    return acc; 
}, []);
return updatedProductsArray;
};

const getAll = async () => {
  const allSales = await salesModel.getAll();
  return allSales; 
};

const getById = async (id) => {
  const result = await salesModel.getById(id);
  if (!result.length) throw objGenerator('Sale not found', 404);
  return result;
};

const addSale = async (salesArray) => {
  const updatedProductsArray = await getUpdatedArray(salesArray);
  if (updatedProductsArray.some((product) => product.quantity < 0)) {
    throw objGenerator('Such amount is not permitted to sell', 422); 
}
  await Promise.all(updatedProductsArray.map((product) => productsService.updateProduct(product)));
  const insertId = await salesModel.addDate();
  const addSalePromises = salesArray.map(({ productId, quantity }) => 
  salesModel.addSale(productId, quantity, insertId));
  const itemsSold = await Promise.all(addSalePromises);
  return { id: insertId, itemsSold };
};

const updateSale = async (productId, quantity, id) => {
  await salesModel.updateSale(productId, quantity, id);
  return { saleId: id, itemUpdated: [{ productId, quantity }] };
};

const deleteSale = async (id) => {
  const saleExists = await salesModel.getById(id);
  if (!saleExists.length) throw objGenerator('Sale not found', 404);
  const updatedProductsArray = await getUpdatedArray(saleExists, 'delete');
  await Promise.all(updatedProductsArray.map((product) => productsService.updateProduct(product)));
  const result = await salesModel.deleteSale(id);
  return result;
};

module.exports = {
  getAll,
  getById,
  addSale,
  updateSale,
  deleteSale,
};