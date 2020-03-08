const Noticia = require('../../models/noticia'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//GET ALL
exports.getNoticias = (req, res, next) => {
    Noticia.find()
        .then(noticias => {
            res.render('admin/noticia/noticia', {
                pageTitle: "Admnistrar noticia",
                noticias: noticias,
                path: "admin/noticia"
            });
        })
        .catch(err => next(new Error(err, 500)));
};

//POST NEW NOTICIA
exports.postNewNoticia = (req, res, next) => {
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
                            res.redirect('/admin/noticia');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                });
        })
        .catch(err => next(err));
};


//GET NEW NOTICIA
exports.getNewNoticia = (req, res, next) => {
    res.render('admin/noticia/new-noticia', {
        path: 'admin/noticia/noticia',
        pageTitle: 'Nova notícia',
        errorMessage: [],
        form: false
    })
};


//GET EDIT NOTICIA
exports.getEditNoticia = (req, res, next) => {
    const notId = req.params.notId;
    Noticia.findOne({
            _id: notId
        })
        .then(work => {
            if (!work) {
                return res.redirect('/admin/noticia')
            }
            res.render('admin/noticia/edit-noticia', {
                pageTitle: "Editar Notícia",
                path: "/admin/noticia",
                work: work,
                errorMessage: [],
                form: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT NOTICIA
exports.postEditNoticia = (req, res, next) => {
    const form = {
        title: req.body.title,
        destaque: req.body.destaque,
        id: req.body.id
    }

    Noticia.findOne({
            _id: form.id
        })
        .then(work => {

            if (!work) {
                return next(new Error('Houve um erro e a notícia não foi encontrada, volte e tente novamente.'));
            }

            Noticia.title = form.title;
            Noticia.description = form.description;
            Noticia.destaque = form.destaque;

            if (req.file) {

                if (work.imageUrl) {
                    cloudinary.uploader.destroy(work.imageUrl.public_id)
                }

                fileHelper.compressImage(req.file)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath)
                            .then(image => {
                                fileHelper.delete(newPath);
                                Noticia.imageUrl = image;
                                Noticia.save();
                                return res.redirect('/admin/noticia');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                Noticia.save();
                return res.redirect('/admin/noticia');
            }
        })
        .catch(err => next(err));
}


//DELETE WORK FROM noticia
exports.deleteNoticia = (req, res, next) => {
    const notId = req.params.notId;
    Noticia.findOneAndDelete({
            _id: notId
        })

        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/noticia');
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