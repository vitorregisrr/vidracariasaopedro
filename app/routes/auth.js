const express = require('express'),
router = express.Router(),
authCtrl = require('../controllers/admin/auth'),
validators = require('../middleware/validators');

//LOGIN
    //GET
    router.get('/admin/login', setLocals, authCtrl.getLogin);
    
    //POST
    router.post('/admin/login', setLocals, validators.login, authCtrl.postLogin);

//LOGOUT
router.post('/admin/logout', setLocals, authCtrl.postLogout);

//REQUEST RESET PASSWORD
    //GET
    router.get('/admin/resetpassword', setLocals, authCtrl.getResetPassword);
    //POST
    router.post('/admin/resetpassword', setLocals, authCtrl.postResetPassword);

//RESET PASSWORD
    //GET
    router.get('/admin/newpassword/:passwordToken', setLocals, authCtrl.getNewPassword);
    //POST
    router.post('/admin/newpassword', validators.resetPassword, setLocals, authCtrl.postNewPassword);

module.exports = router;