const router = require('express').Router();
const salesController = require('../controllers/salesController');

router.get('/:id', salesController.getById);

router.post('/', salesController.addSale);

router.get('/', salesController.getAll);

module.exports = router;