const Product = require('../../models/product'),
    Work = require('../../models/work'),
    User = require('../../models/user'),
    Depoimento = require('../../models/depoimento'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//PORTFOLIO
exports.getPortfolio = (req, res, next) => {
    Work.find()
        .then(works => {
            res.render('admin/portfolio/portfolio', {
                pageTitle: "Admnistrar Portfolio",
                works: works,
                path: "admin/portfolio"
            });
        })
        .catch(err => next(new Error(err, 500)));
};

//POST NEW WORK PORTFOLIO
exports.postNewWork = (req, res, next) => {
    fileHelper.compressImage(req.file)
        .then(newPath => {
            cloudinary.uploader.upload(newPath)
                .then(image => {
                    fileHelper.delete(newPath);
                    new Work({
                            ...req.body,
                            image: image,
                        })
                        .save()
                        .then(resul => {
                            res.redirect('/admin/portfolio');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                });
        })
        .catch(err => next(err));
};


//GET NEW WORK PORTFOLIO
exports.getNewWork = (req, res, next) => {
    res.render('admin/portfolio/new-work', {
        path: 'admin/portfolio/portfolio',
        pageTitle: 'Novo Trabalho',
        errorMessage: [],
        form: false
    })
};


//GET EDIT WORK PORTFOLIO
exports.getEditWork = (req, res, next) => {
    const workID = req.params.workID;
    Work.findOne({
            _id: workID
        })
        .then(work => {
            if (!work) {
                return res.redirect('/admin/portfolio')
            }
            res.render('admin/portfolio/edit-work', {
                pageTitle: "Editar Trabalho",
                path: "/admin/portfolio",
                work: work,
                errorMessage: [],
                form: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT PRODUCT CATALOGO
exports.postEditWork = (req, res, next) => {
    const form = {
        title: req.body.title,
        destaque: req.body.destaque,
        id: req.body.id
    }

    Work.findOne({
            _id: form.id
        })
        .then(work => {

            if (!work) {
                return next(new Error('Houve um erro e o trabalho não foi encontrado, volte e tente novamente.'));
            }

            work.title = form.title;
            work.description = form.description;
            work.destaque = form.destaque;

            if (req.file) {

                if (work.imageUrl) {
                    cloudinary.uploader.destroy(work.imageUrl.public_id)
                }

                fileHelper.compressImage(req.file)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath)
                            .then(image => {
                                fileHelper.delete(newPath);
                                work.imageUrl = image;
                                work.save();
                                return res.redirect('/admin/portfolio');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                work.save();
                return res.redirect('/admin/portfolio');
            }
        })
        .catch(err => next(err));
}


//DELETE WORK FROM PORTFOLIO
exports.deleteWork = (req, res, next) => {
    const workId = req.params.workId;
    Work.findOneAndDelete({
            _id: workId
        })

        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/portfolio');
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