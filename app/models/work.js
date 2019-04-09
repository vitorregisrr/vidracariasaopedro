const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Work = new Schema({
    title: {
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

module.exports = mongoose.model('Work', Work);