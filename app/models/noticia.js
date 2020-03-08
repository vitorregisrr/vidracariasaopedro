const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Noticia = new Schema({
    title: {
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
    
    body:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Noticia', Noticia);