const Noticia = require('../../models/noticia'),
    slugify = require('slugify')
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//GET ALL
exports.getNoticias = (req, res, next) => {
    Noticia.find()
        .sort({
            date: -1
        })
        .then(noticias => {
            res.render('admin/noticia/noticias', {
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
                    new Noticia({
                            ...req.body,
                            imageUrl: image,
                            slug: slugify(req.body.title) + '-' + Date.now()
                        })
                        .save()
                        .then(resul => {
                            res.redirect('/admin/noticias');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                })
                .catch(err => {
                    next(err);
                });
        })
        .catch(err => next(err));
};


//GET NEW NOTICIA
exports.getNewNoticia = (req, res, next) => {
    res.render('admin/noticia/new-noticia', {
        path: 'admin/noticia/noticias  ',
        pageTitle: 'Nova notícia',
        errorMessage: [],
        form: false
    })
};


//GET EDIT NOTICIA
exports.getEditNoticia = (req, res, next) => {
    const id = req.params.id;
    Noticia.findOne({
            _id: id
        })
        .then(noticia => {
            if (!noticia) {
                return res.redirect('/admin/noticias')
            }
            res.render('admin/noticia/edit-noticia', {
                pageTitle: "Editar Notícia",
                path: "/admin/noticia",
                noticia: noticia,
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
        desc: req.body.desc,
        body: req.body.body,
        id: req.body.id
    }

    Noticia.findOne({
            _id: form.id
        })
        .then(work => {

            if (!work) {
                return next(new Error('Houve um erro e a notícia não foi encontrada, volte e tente novamente.'));
            }

            work.title = form.title;
            work.desc = form.desc;
            work.body = form.body;
            work.slug = slugify(req.body.title) + '-' + Date.now(); 
            
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
                                return res.redirect('/admin/noticias');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                work.save();
                return res.redirect('/admin/noticias');
            }
        })
        .catch(err => next(err));
}


//DELETE WORK FROM noticia
exports.deleteNoticia = (req, res, next) => {
    const id = req.params.id;
    Noticia.findOneAndDelete({
            _id: id
        })

        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/noticias');
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