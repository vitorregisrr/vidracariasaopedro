const fs = require('fs'),
    sharp = require('sharp');
sharp.cache(false);

exports.delete = path => {
    fs.unlink(path, err => {
        if (err) {
        }
    });

}

exports.compressImage = (file, size) => {
    const newPath = file.path.split('.')[0] + '.jpeg';

    return sharp(file.path)
        .resize(size)
        .toFormat('jpeg')
        .jpeg({
            quality: 80
        })
        .toBuffer()
        .then(data => {
            // delete the old one
            fs.access(file.path, (err) => {
                if (!err) {
                    fs.unlink(file.path, err => {
                        if (err) console.log(err)
                    })
                }
            });

            let resul = newPath;
            //create the new
            fs.writeFile(newPath, data, err => {
                if (err) {
                    next(err);
                }
            });

            return resul;
        })
        .catch( err => err)
}


exports.compressImagesArray = (files, size) => {
    const compressPromisse = files.map(file => {
        const newPath = file.path.split('.')[0] + '.jpeg';

        return sharp(file.path)
            .resize(size)
            .toFormat('jpeg')
            .jpeg({
                quality: 80
            })
            .toBuffer()
            .then(data => {

                // delete the old one
                fs.access(file.path, (err) => {
                    if (!err) {
                        fs.unlink(file.path, err => {
                            if (err) console.log(err)
                        })
                    }
                });

                let resul = newPath;

                //create the new
                fs.writeFile(newPath, data, err => {
                    if (err) {
                        next(err);
                    }
                });

                return resul;
            })
    });

    return Promise.all(compressPromisse)
}