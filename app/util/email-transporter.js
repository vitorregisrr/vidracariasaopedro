const sendgridTransport = require('nodemailer-sendgrid-transport'),
    nodemailer = require('nodemailer');

let SENDGRID_KEY = '';

try {
    SENDGRID_KEY = require('../../config').SENDGRID_KEY;
} catch (err) {
    SENDGRID_KEY = process.env.SENDGRID_KEY;
}

module.exports = () => {
    return nodemailer.createTransport(sendgridTransport({
        auth: {
            api_key: SENDGRID_KEY
        }
    }));
}