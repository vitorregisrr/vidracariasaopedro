const User = require('../../models/user'),
    transporter = require('../../util/email-transporter')(),
    Product = require('../../models/product'),
    Work = require('../../models/work'),
    Depoimento = require('../../models/depoimento'),
    fileHelper = require('../../util/file-helper');


exports.getLogin = (req, res, next) => {
    if (!req.user) {
        return res.render('admin/auth/login', {
            pageTitle: 'Login',
            path: '/login',
            form: null,
            errorMessage: req.errors
        })
    }
    return res.redirect('/');
}

exports.postLogin = (req, res, next) => {
    const form = {
        ...req.body
    };

    User.findOne({
            usuario: form.usuario
        })
        .then(user => {
            if (!user) {
                return res
                    .status(422)
                    .render('admin/auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: ["Usuário não encontrado!"],
                        form: {
                            values: {
                                email: '',
                                password: ''
                            },
                            hasError: ['email']
                        }
                    })
            }

            if (user.password == form.password) {
                req.session.user = user;
                return req.session.save(err => {
                    if (err) {
                        next(err);
                    }
                    return res.redirect('/admin');
                });
            } else {
                return res
                    .status(422)
                    .render('admin/auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: ["Senha inválida!"],
                        form: {
                            values: {
                                usuario: form.usuario
                            },
                            hasError: ['password']
                        }
                    })
            }

        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.getResetPassword = (req, res, next) => {
    res.render('admin/auth/resetpassword', {
        path: '/resetpassword',
        pageTitle: 'Resetar senha',
        errorMessage: req.flash('error'),
        form: null
    });
}

exports.postResetPassword = (req, res, next) => {
    const form = {
        email: req.body.emailreset
    }

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return err
        }

        const token = buffer.toString('hex');

        User.findOne({
                email: form.email
            })
            .then(user => {
                if (!user) {
                    return req.session.save(err => {
                        return res.redirect('/resetpassword');
                    });
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(user => {
                if (!user) {
                    return false;
                }

                transporter.sendMail({
                        to: user.email,
                        from: 'vitorregisrr@gmail.com',
                        subject: 'Password Reset',
                        html: `
                    <h3> You requested a password reset! </h3>
                    <p>Clique <a href="http://localhost:3000/newpassword/${user.resetToken}">here</a> to reset your password!</a></p>
                `
                    })
                    .catch(err => next(err))

                return res.redirect('/');
            })
            .catch(err => next(new Error(err, 500)));
    })
}

exports.getNewPassword = (req, res, next) => {
    const userToken = req.params.passwordToken;
    User.findOne({
            resetToken: userToken,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            if (!user) {
                req.sessreq.flash('error', 'O token para trocar de senha já expirou.');
                return req.session.save(err => {
                    return res.redirect('/resetpassword');
                });
            }
            return res.render('auth/newpassword', {
                path: '/newpassword',
                pageTitle: 'New Password',
                errorMessage: req.flash('error'),
                user: user.id.toString(),
                form: null
            })
        })
        .catch(err => next(new Error('Request failed by a server-side error. Please, try again.', err, 500)));
};

exports.postNewPassword = (req, res, next) => {
    const form = {
        password: req.body.newpassword,
        passwordrpt: req.body.newpasswordrpt,
        user: req.body.user
    }

    User.findById(form.user)
        .then(user => {
            if (!user) {
                req.flash('error', 'An error happened with your token. Please, try again.')
                return req.session.save(err => {
                    return res.redirect('/resetpassword');
                });
            }
            bcrypt.hash(form.password, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = null,
                        user.resetTokenExpiration = null,
                        user.save();
                    return res.redirect('/login');
                })
        })
        .catch(err => next(err, 500));
}