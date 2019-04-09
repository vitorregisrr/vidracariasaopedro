const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Depoimento = new Schema({
    autor: {
        type: String,
        required: true
    },

    empresa: {
        type: String,
        required: true
    },

    depoimento: {
        type: String,
        required: true
    },
    
    imageUrl: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model('Depoimento', Depoimento);