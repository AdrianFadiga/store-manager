const router = require('express').Router();
const salesController = require('../controllers/salesController');
const middleware = require('../middlewares');

router.get('/:id', salesController.getById);

router.put('/:id', middleware.validateAddSaleArray, salesController.updateSale);

router.post('/', middleware.validateAddSaleArray, salesController.addSale);

router.get('/', salesController.getAll);

module.exports = router;