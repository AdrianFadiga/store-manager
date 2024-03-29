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

const getByName = async (name) => {
  const query = 'SELECT * FROM products WHERE name=?';
  const [result] = await connection.execute(query, [name]);
  return result[0];
};

const addProduct = async (name, quantity) => {
  const query = 'INSERT INTO products (name, quantity) VALUES (?, ?)';
  const [result] = await connection.execute(query, [name, quantity]);
  return { id: result.insertId, name, quantity };
};

const updateProduct = async ({ id, name, quantity }) => {
  const query = 'UPDATE products SET name = ?, quantity = ? WHERE id = ?';
  await connection.execute(query, [name, quantity, id]);
  return { id, name, quantity };
};

const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id=?';
  await connection.execute(query, [id]);
  return { status: 204 };
};

module.exports = {
  getAll,
  getById,
  getByName,
  addProduct,
  updateProduct,
  deleteProduct,
};