const {
    check,
    body,
    validationResult
} = require('express-validator/check'),
    User = require('../models/user'),
    Product = require('../models/product'),
    fs = require('fs');

exports.resetPassword = [
    // Express Validation
    [
        body('newpassword', 'Please enter a valid Password')
        .isLength({
            min: 8,
            max: 18
        })
        .withMessage('The password must have at least 8 and at most 18 characters')
        .trim(),

        body('confirmnewpassword')
        .custom((value, {
            req
        }) => {
            if (value !== req.body.newpassword) {
                throw new Error('The passwords must match!')
            }
            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('auth/newpassword', {
                    path: 'auth/new-password',
                    pageTitle: 'New Password',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    user: req.body.user
                })
        } else {
            next();
        }
    }

]

exports.login = [
    [
        body('usuario', 'Usuário inválido.')
        .isString(),

        body('password', 'Senha inválida, por favor insira uma senha.')
        .isLength({
            min: 5,
            max: 14
        })
        .withMessage('A senha deve ter entre 5 e 14 caracteres.')
        .trim(),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/auth/login', {
                    path: '/login',
                    pageTitle: 'Sign Up',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }

]


exports.product = [
    [
        body('title', 'O título deve ter entre 5 e 40 caracteres.')
        .isLength({
            max: 40,
            min: 5
        }),

        body('description', 'A descrição deve ter entre 5 e 150 caracteres.')
        .isLength({
            max: 150,
            min: 5
        }),

        body('categoria', 'Categoria inválida!')
        .isString(),

        body('image', 'Imagem inválida, por favor entre uma imagem!')
        .custom((value, {
            req
        }) => {
            if (!req.file) {
                throw new Error('Formato de imagem inválido, aceitos: jpeg, jpg e png.')
            }

            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            return res
                .status(422)
                .render('admin/catalogo/new-product', {
                    path: 'admin/catalogo',
                    pageTitle: 'New Product',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }
]

exports.work = [
    [
        body('title', 'O titulo deve ter entre 5 e 40 caracteres.')
        .isLength({
            max: 40,
            min: 5
        }),

        body('image', 'Imagem inválida, por favor entre uma imagem!')
        .custom((value, {
            req
        }) => {
            if (!req.file) {
                throw new Error('Formato de imagem inválido, aceitos: jpeg, jpg e png.')
            }

            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            return res
                .status(422)
                .render('admin/portfolio/new-work', {
                    path: 'admin/portfolio',
                    pageTitle: 'New Work',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }
]


exports.editwork = [
    [
        body('title', 'O titulo deve ter entre 5 e 40 caracteres.')
        .isLength({
            max: 40,
            min: 5
        }),

    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            return res
                .status(422)
                .render('admin/portfolio/edit-work', {
                    path: 'admin/portfolio',
                    pageTitle: 'Editar Trabalho',
                    errorMessage: errors.array(),
                    work: {...req.body},
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }
]



exports.editProduct = [
    body('title', 'O Título deve ter entre 5 e 40 caraceteres.')
    .isLength({
        max: 40,
        min: 5
    }),

    body('description', 'A descrição dev ter entre 5 e 150 caracteres.')
    .isLength({
        max: 150,
        min: 5
    }),

    body('categoria', 'Categoria incorreta')
    .isString(),


    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/catalogo/edit-product', {
                    path: 'admin/catalogo',
                    pageTitle: 'Edit Product',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    prod: {
                        ...req.body
                    }
                })
        } else {
            next();
        }
    }
]


exports.depoimento = [
    [
        body('autor', 'O autor deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
        }),

        body('depoimento', 'O depoimento deve te rentre 30 e 100 caracteres.')
        .isLength({
            max: 100,
            min: 30
        }),

        body('image', 'Imagem inválida, por favor escolha uma imagem!')
        .custom((value, {
            req
        }) => {
            if (!req.file) {
                throw new Error('Formato de imagem inválida, aceitos: png, jpeg e jpg.')
            }

            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            return res
                .status(422)
                .render('admin/depoimento/new-depoimento', {
                    path: 'admin/depoimentos',
                    pageTitle: 'Novo Depoimento',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }
]


exports.editDepoimento = [
    body('autor', 'O autor deve ter entre 25 e 5 caracteres.')
    .isLength({
        max: 25,
        min: 5
    }),

    body('depoimento', 'O depoimento deve ter entre 100 e 30 caracteres.')
    .isLength({
        max: 100,
        min: 30
    }),

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/depoimento/edit-depoimento', {
                    path: 'admin/depoimentos',
                    pageTitle: 'Editar Depoimento',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    prod: {
                        ...req.body
                    }
                })
        } else {
            next();
        }
    }
]