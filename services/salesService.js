const salesModel = require('../models/salesModel');

const objGenerator = (message, status) => ({
  message,
  status,
});

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
  const insertId = await salesModel.addDate();
  const promises = salesArray.map(({ productId, quantity }) => 
  salesModel.addSale(productId, quantity, insertId));
  const itemsSold = await Promise.all(promises);
  return { id: insertId, itemsSold };
};

const updateSale = async (productId, quantity, id) => {
  await salesModel.updateSale(productId, quantity, id);
  return { saleId: id, itemUpdated: [{ productId, quantity }] };
};

const deleteSale = async (id) => {
  const saleExists = await salesModel.getById(id);
  if (!saleExists) throw objGenerator('Sale not found', 404);
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