const cloudinary = require('cloudinary');

let CLOUDINARY_KEY;
let CLOUDINARY_SECRET;

try {
    const config = require('../../config');
    CLOUDINARY_KEY = config.CLOUDINARY_KEY;
    CLOUDINARY_SECRET = config.CLOUDINARY_SECRET;
} catch (err) {
    CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
    CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
}


cloudinary.config({
    cloud_name: 'dnezk6rgu',
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET,
    upload_preset: 'website'
});

module.exports = cloudinary;