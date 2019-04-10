const express = require('express'),
    router = express.Router(),
    pagesCtrl = require('../controllers/public/pages'),
    validators = require('../middleware/validators');

router.get('/', pagesCtrl.getIndex);
router.get('/portfolio', pagesCtrl.getPortfolio);
router.get('/catalogo', pagesCtrl.getCatalogo);
router.get('/contato', pagesCtrl.getContato);
router.post('/contato', validators.contato, pagesCtrl.postContato);

module.exports = router;