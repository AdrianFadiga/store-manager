const router = require('express').Router();
const productsController = require('../controllers/productsController');

router.get('/:id', productsController.getById);

router.get('/', productsController.getAll);

module.exports = router;