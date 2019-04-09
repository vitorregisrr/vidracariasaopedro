const express = require('express'),
    router = express.Router(),
    pagesCtrl = require('../controllers/public/pages');

router.get('/', pagesCtrl.getIndex);
router.get('/portfolio', pagesCtrl.getPortfolio);
router.get('/catalogo', pagesCtrl.getCatalogo);
router.get('/contato', pagesCtrl.getContato);

module.exports = router;