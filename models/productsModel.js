const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT * FROM products';
  const [allProducts] = await connection.execute(query);
  return allProducts;
};

const getById = async (id) => {
  const query = 'SELECT * FROM products WHERE id=?';
  const [result] = await connection.execute(query, [id]);
  return result[0];
};

const getByName = async () => null;

const addProduct = async () => null;

module.exports = {
  getAll,
  getById,
  getByName,
  addProduct,
};