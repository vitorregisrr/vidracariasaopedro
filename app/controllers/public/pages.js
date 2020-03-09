const Product = require('../../models/product'),
    Work = require('../../models/work'),
    Noticia = require('../../models/noticia'),
    transporter = require('../../util/email-transporter')(),
    Depoimento = require('../../models/depoimento');

exports.getIndex = (req, res, next) => {
    Depoimento
        .find()
        .then(deps => {
            Work
                .find({
                    destaque: true
                })
                .limit(8)
                .then(works => {
                    Product
                        .find({
                            destaque: true
                        })
                        .limit(6)
                        .then(prods => {
                            Noticia.find()
                            .sort({date: -1})
                            .limit(3)
                            .then( noticias => {
                                res.render('shop/index', {
                                    pageTitle: "Vidros e Esquadrias de Aluminío em Bagé-RS",
                                    path: "/",
                                    deps,
                                    works,
                                    noticias,
                                    prods,
                                    csrfToken: req.csrfToken()
                                })
                            })
                        })
                })
        })
        .catch(err => next(err));
}

//CATALOGO
exports.getPortfolio = (req, res, next) => {
    const currentPage = req.query.page ?
        parseInt(req.query.page) :
        1,
        ITEMS_PER_PAGE = 6;
    let totalItems;

    let query = {};
    if (req.query.categoria && req.query.categoria !== 'destaques') {
        query.categoria = req.query.categoria;
    } else {
        query.destaque = true;
    }

    Work
        .find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            Work
                .find({
                    ...query
                })
                .then(works => {
                    res.render('shop/portfolio', {
                        pageTitle: "Portfólio",
                        works: works,
                        path: "/portfolio",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                        csrfToken: req.csrfToken()
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
}

//CATALOGO
exports.getCatalogo = (req, res, next) => {
    res.render('shop/catalogo', {
        pageTitle: "Catálogo de produtos",
        path: "/catalogo",
        csrfToken: req.csrfToken()
    });
}

// API GET PRODUTS
exports.getProdutos = (req, res, next) => {
    const current_page = parseInt(req.query.currPage) || 1;
    const page_items = parseInt(req.query.page_items) || 5;

    query = {};
    if (req.query.categoria && req.query.categoria !== 'destaques') {
        query.categoria = req.query.categoria
    } else {
        query.destaque = true;
    }

    Product
        .find({
            ...query
        })
        .countDocuments()
        .then(num => {
            const totalItems = num;
            const totalPages = Math.ceil(totalItems / page_items);

            Product
                .find({
                    ...query
                })
                .skip((current_page - 1) * page_items)
                .limit(page_items)
                .then(produtos => {
                    return res
                        .status(200)
                        .json(JSON.stringify({
                            produtos: produtos,
                            has_next: current_page < totalPages
                        }));
                })
                .catch(err => res.status(500).json({
                    "message": err
                }))
        })
        .catch(err => res.status(500).json({
            "message": err
        }))
};

exports.getContato = (req, res, next) => {
    res.render('shop/contato', {
        pageTitle: "Contato",
        path: "/contato",
        errorMessage: [],
        successMessage: false,
        csrfToken: req.csrfToken(),
        form: false
    });
}

exports.postContato = (req, res, next) => {
    transporter
        .sendMail({
            to: 'vidracariasaopedro@brturbo.com.br',
            from: req.body.email,
            subject: 'Mensagem de contato recebida pelo site!',
            html: `
                    <h3> Você recebeu uma nova mensagem de contato a partir do formulário do seu site! </h3>
                    <p>De: ${req.body.nome}</p>
                    <p>Telefone: ${req.body.telefone}</p>
                    <p>E mail: ${req.body.email}</p>
                    <p>Endereço: ${req.body.endereco}</p>
                    <p>Com a mensagem: ${req.body.mensagem}</p>
                    <h5> Responda o mais rápido possível, não deixe seu cliente esperando! </h5>
                `
        })
        .then(resul => {
            res.render('shop/contato', {
                pageTitle: "Entre em contato conosco!",
                path: "/contato",
                errorMessage: [],
                successMessage: 'Mensagem enviada, assim que possível entraremos em contato com uma resposta!',
                csrfToken: req.csrfToken(),
                form: false
            });
        })
        .catch(err => next(err))
}

//GET NOTÍCIAS
exports.getNoticias = (req, res, next) => {
    const currentPage = req.query.page ?
        parseInt(req.query.page) :
        1,
        ITEMS_PER_PAGE = 6;
    let totalItems;

    Noticia
        .find()
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Noticia
                .find()
                .then(noticias => {
                    res.render('shop/noticias', {
                        pageTitle: "Notícias",
                        noticias: noticias,
                        path: "/noticias",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                        csrfToken: req.csrfToken()
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
}

//GET NOTÍCIAS
exports.getNoticia = (req, res, next) => {
    const slug = req.params.slug;
    
    Noticia
        .findOne({
            slug
        })
        .then(noticia => {
            res.render('shop/noticia', {
                pageTitle: noticia.title,
                noticia: noticia,
                path: "/noticias",
                csrfToken: req.csrfToken()
            })
        })
        .catch(err => next(err, 500));
}