const multer = require('multer');

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './app/public/temp');
        },

        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);

        }
    }),

    fileFilter: (req, file, cb) => {
         
        // Array com os formatos aceitos
        const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find( t => file.mimetype == t );

        if(isAccepted){
            return cb(null, true);
        }

        return cb(null, false);

    } 
 
}));