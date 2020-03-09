const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Noticia = new Schema({
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },
    
    imageUrl: {
        type: Object,
        required: false
    },

    date: {
        type: Date,
        default: Date.now()
    },
    
    body:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Noticia', Noticia);