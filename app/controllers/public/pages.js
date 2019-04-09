const Product = require('../../models/product'),
    Work = require('../../models/work'),
    Depoimento = require('../../models/depoimento');

exports.getIndex = (req, res, next) => {
    Depoimento.find()
        .then(deps => {
            Work.find({
                    destaque: true
                })
                .limit(8)
                .then(works => {
                    Product.find({
                            destaque: true
                        })
                        .limit(6)
                        .then(prods => {
                            res.render('shop/index', {
                                pageTitle: "Vidros e Esquadrias de Aluminío em Bagé-RS",
                                path: "/",
                                deps,
                                works,
                                prods
                            });
                        })
                })
        })
        .catch(err => next(err));
}

//CATALOGO
exports.getPortfolio = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 6;
    let totalItems;

    let query = {};
    if (req.query.categoria) {
        query.categoria = req.query.categoria;

    } else {
        query.destaque = true;
    }

    Work.find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Work.find({
                    ...query
                })
                // .skip((currentPage - 1) * ITEMS_PER_PAGE)
                // .limit(ITEMS_PER_PAGE)
                .then(works  => {
                    res.render('shop/portfolio', {
                        pageTitle: "Portfólio",
                        works : works ,
                        path: "/portfolio",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
}

//CATALOGO
exports.getCatalogo = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 6;
    let totalItems;

    let query = {};
    if (req.query.categoria) {
        query.categoria = req.query.categoria;
    }

    Product.find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Product.find({
                    ...query
                })
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(prods => {
                    res.render('shop/catalogo', {
                        pageTitle: "Catálogo de produtos",
                        prods: prods,
                        path: "/catalogo",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                        filtro : query
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
}

exports.getProducts = (req, res, next) => {
    const currentPage = req.body.currPage ? parseInt(req.currPage.page) : 1,
        ITEMS_PER_PAGE = req.body.itemsNumber || 8;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Product.find()
                .skip((currPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(prods => {
                    res.status(200).json({
                        prods
                    })
                })
                .catch(err => res.status(500).json({
                    "message": err
                }));
        })
        .catch(err => next(err, 500));
};

exports.getContato = (req, res, next) => {
    res.render('shop/contato', {
        pageTitle: "Vidros e Esquadrias de Aluminío em Bagé-RS",
        path: "/contato",
        banner: {
            id: "banner-contato",
            title: "Contate-nos",
            subtitle: "Faça um orçamento ou tire suas dúvidas!",
            mapName: "Contato"
        }
    });
}