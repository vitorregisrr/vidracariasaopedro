const express = require('express'),
    router = express.Router(),
    pagesCtrl = require('../controllers/public/pages'),
    validators = require('../middleware/validators');

router.get('/', pagesCtrl.getIndex);
router.get('/portfolio', pagesCtrl.getPortfolio);
router.get('/catalogo', pagesCtrl.getCatalogo);
router.get('/noticias', pagesCtrl.getNoticias);
router.get('/noticias/:slug', pagesCtrl.getNoticia);
router.get('/contato', pagesCtrl.getContato);
router.post('/contato', validators.contato, pagesCtrl.postContato);

router.get('/api/getProdutos', pagesCtrl.getProdutos);

module.exports = router;