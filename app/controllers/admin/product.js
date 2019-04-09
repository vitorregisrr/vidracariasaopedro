const Product = require('../../models/product'),
    Work = require('../../models/work'),
    User = require('../../models/user'),
    Depoimento = require('../../models/depoimento'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//CATALOGO
exports.getCatalogo = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Product.find()
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(prods => {
                    res.render('admin/catalogo/catalogo', {
                        pageTitle: "Gerenciar Catálogo",
                        prods: prods,
                        path: "admin/catalogo",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};

//GET NEW PRODUCT CATALOGO
exports.getNewProduct = (req, res, next) => {
    res.render('admin/catalogo/new-product', {
        pageTitle: "Novo Produto",
        path: "admin/catalogo",
        errorMessage: [],
        form: false
    });
};

//POST NEW PRODUCT CATALOGO
exports.newProduct = (req, res, next) => {
    fileHelper.compressImage(req.file)
        .then(newPath => {
            cloudinary.uploader.upload(newPath)
                .then(image => {
                    fileHelper.delete(newPath);
                    new Product({
                            ...req.body,
                            imageUrl: image,
                        })
                        .save()
                        .then(resul => {
                            res.redirect('/admin/catalogo');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                });
        })
        .catch(err => next(err));
};

//GET EDIT PRODUCT CATALOGO
exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.productId;
    Product.findOne({
            _id: prodID
        })
        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/catalogo')
            }
            res.render('admin/catalogo/edit-product', {
                pageTitle: "Editar Produto",
                path: "/admin/catalogo",
                prod: prod,
                errorMessage: [],
                form: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT PRODUCT CATALOGO
exports.postEditProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
        description: req.body.description,
        categoria: req.body.categoria,
        id: req.body.id,
        destaque: req.body.destaque
    }

    Product.findOne({
            _id: form.id
        })
        .then(prod => {

            if (!prod) {
                return next(new Error('Houve um erro e o seu produto não foi encontrado, volte e tente novamente.'));
            }

            prod.title = form.title;
            prod.description = form.description;
            prod.categoria = form.categoria;
            prod.destaque = form.destaque;

            if (req.file) {

                if (prod.imageUrl) {
                    cloudinary.uploader.destroy(prod.imageUrl.public_id);
                }

                fileHelper.compressImage(req.file)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath)
                            .then(image => {

                                fileHelper.delete(newPath);
                                prod.imageUrl = image;
                                prod.save();
                                return res.redirect('/admin/catalogo');
                            })
                    })
                    .catch(err => next(err));
            } else {

                prod.save();
                return res.redirect('/admin/catalogo');
            }

        })
        .catch(err => next(err));
}

//DELETE PRODUCT CATALOGO
exports.deleteProduct = (req, res, next) => {
    const prodID = req.params.productId;

    Product.findOneAndDelete({
            _id: prodID
        })

        .then(prod => {
            if (!prod) {
                return res.status(500).json({
                    "message": "Error",
                });
            }

            if (prod.imageUrl) {
                fileHelper.delete(`app/public/${prod.imageUrl}`);
            }

            return res.status(200).json({
                "message": "Success"
            });

        })

        .catch(err => {
            res.status(500).json({
                "message": "Error",
            });
        });
};