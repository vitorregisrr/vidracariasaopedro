const Product = require('../../models/product'),
    Work = require('../../models/work'),
    User = require('../../models/user'),
    Depoimento = require('../../models/depoimento'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//DEPOIMENTO
exports.getDepoimentos = (req, res, next) => {
    Depoimento.find()
        .then(deps => {
            res.render('admin/depoimento/depoimentos', {
                pageTitle: "Gerenciar Depoimentos",
                deps: deps,
                path: "admin/depoimento/depoimentos"
            });
        })
        .catch(err => next(err, 500));
};


//GET NEW DEPOIMENTO
exports.getNewDepoimento = (req, res, next) => {
    res.render('admin/depoimento/new-depoimento', {
        pageTitle: "Novo Depoimento",
        path: "admin/depoimento/depoimentos",
        errorMessage: [],
        form: false
    });
};

//POST NEW DEPOIMENTO
exports.postNewDepoimento = (req, res, next) => {
    fileHelper.compressImage(req.file)
        .then(newPath => {
            cloudinary.uploader.upload(newPath)
                .then(image => {
                    fileHelper.delete(newPath);
                    new Depoimento({
                            ...req.body,
                            imageUrl: image,
                        })
                        .save()
                        .then(resul => {
                            res.redirect('/admin/depoimentos');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                });
        })
        .catch(err => next(err));
};

//GET EDIT DEPOIMENTO
exports.getEditDepoimento = (req, res, next) => {
    const depId = req.params.depId;

    Depoimento.findOne({
            _id: depId
        })
        .then(dep => {
            if (!dep) {
                return res.redirect('/admin/depoimentos')
            }
            res.render('admin/depoimento/edit-depoimento', {
                pageTitle: "Editar Depoimento",
                path: "/admin/depoimentos",
                dep: dep,
                errorMessage: [],
                form: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT DEPOIMENTO
exports.postEditDepoimento = (req, res, next) => {
    const form = {
        nome: req.body.nome,
        empresa: req.body.empresa,
        depoimento: req.body.depoimento,
        id: req.body.id,
    }

    Depoimento.findOne({
            _id: form.id
        })
        .then(dep => {

            if (!dep) {
                return next(new Error('Houve um erro e o seu depoimento não foi encontrado, volte e tente novamente.'));
            }

            dep.nome = form.nome;
            dep.empresa = form.empresa;
            dep.depoimento = form.depoimento;

            if (req.file) {

                if (dep.imageUrl) {
                    cloudinary.uploader.destroy(dep.imageUrl.public_id);
                }

                fileHelper.compressImage(req.file)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath)
                            .then(image => {

                                fileHelper.delete(newPath);
                                dep.imageUrl = image;
                                dep.save();
                                return res.redirect('/admin/depoimentos');
                            })
                    })
                    .catch(err => next(err));
            } else {

                dep.save();
                return res.redirect('/admin/depoimentos');
            }

        })
        .catch(err => next(err));
}

//DELETE DEPOIMENTO
exports.deleteDepoimento = (req, res, next) => {
    const depId = req.params.depId;

    Depoimento.findOneAndDelete({
            _id: depId
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