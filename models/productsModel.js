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

module.exports = {
  getAll,
  getById,
};