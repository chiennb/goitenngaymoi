var mongoose = require('mongoose');


var BookSchema = new mongoose.Schema({
    email: String,    
    tickettype: String,
    status: { type: String, default: 'pending'},
    note: String,
    created_time: { type: Date, default: Date.now },
    modified_by:String,
    modified_time: Date
});


module.exports = mongoose.model('Book', BookSchema);
