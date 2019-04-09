module.exports = (req, res, next) => {
    //setting locals
    res.locals.isAdmin = req.user ? req.user : null;
    res.locals.csrfToken = req.csrfToken();
    next();
};