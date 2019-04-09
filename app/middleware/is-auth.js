const User = require('../models/user');

module.exports = (req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.log(err));
    } else {
        req.user = null;
        return res.redirect('/admin/login');
    }

}