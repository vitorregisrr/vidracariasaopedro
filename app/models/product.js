const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    title: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    },

    categoria: {
        type: String,
        required: true
    },
    
    imageUrl: {
        type: Object,
        required: false
    },

    destaque:{
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Product', Product);