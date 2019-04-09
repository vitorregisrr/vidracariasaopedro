const express = require('express'),
    router = express.Router(),
    setLocals = require('../middleware/set-locals'),
    isAuth = require('../middleware/is-auth'),
    validators = require('../middleware/validators');

const adminCtrl = {
    auth : require('../controllers/admin/auth'),
    depoimento : require('../controllers/admin/depoimento'),
    product : require('../controllers/admin/product'),
    work : require('../controllers/admin/work'),
}

//INDEX 
router.get('/admin', isAuth, setLocals, adminCtrl.product.getCatalogo);

//CATALOGO
router.get('/admin/catalogo', isAuth, setLocals, adminCtrl.product.getCatalogo);
    //GET NEW
    router.get('/admin/catalogo/new', isAuth, setLocals, adminCtrl.product.getNewProduct);
    //POST NEW
    router.post('/admin/catalogo/new', isAuth, setLocals, validators.product, adminCtrl.product.newProduct);
    //GET EDIT
    router.get('/admin/catalogo/edit/:productId', isAuth, setLocals, adminCtrl.product.getEditProduct);
    //POST EDIT
    router.post('/admin/catalogo/edit', isAuth, setLocals, validators.editProduct, adminCtrl.product.postEditProduct);
    //DELETE 
    router.delete('/admin/catalogo/delete/:productId', isAuth, setLocals, adminCtrl.product.deleteProduct);

//PORTFOLIO
    router.get('/admin/portfolio', isAuth, setLocals, adminCtrl.work.getPortfolio);
    //GET NEW
    router.get('/admin/portfolio/new', isAuth, setLocals, adminCtrl.work.getNewWork);
    //POST NEW
    router.post('/admin/portfolio/new', isAuth, validators.work, setLocals, adminCtrl.work.postNewWork);
     //GET EDIT
     router.get('/admin/portfolio/edit/:workID', isAuth, setLocals, adminCtrl.work.getEditWork);
     //POST EDIT
     router.post('/admin/portfolio/edit', isAuth, setLocals, validators.editwork, adminCtrl.work.postEditWork);
     
    //DELETE 
    router.delete('/admin/portfolio/delete/:workId', isAuth, setLocals, adminCtrl.work.deleteWork);

//DEPOIMENTOS
    router.get('/admin/depoimentos', isAuth, setLocals, adminCtrl.depoimento.getDepoimentos);
    //GET NEW
    router.get('/admin/depoimentos/new', isAuth, setLocals, adminCtrl.depoimento.getNewDepoimento);
    //POST NEW
    router.post('/admin/depoimentos/new', isAuth, setLocals, validators.depoimento, adminCtrl.depoimento.postNewDepoimento);
    //GET EDIT
    router.get('/admin/depoimentos/edit/:depId', isAuth, setLocals, adminCtrl.depoimento.getEditDepoimento);
    //POST EDIT
     router.post('/admin/depoimentos/edit', isAuth, setLocals, validators.editDepoimento, adminCtrl.depoimento.postEditDepoimento);
    //DELETE 
    router.delete('/admin/depoimentos/delete/:depId', isAuth, setLocals, adminCtrl.depoimento.deleteDepoimento);

module.exports = router;