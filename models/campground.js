const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);// willcreate a database of name campgrounds
//model is related to collection and while defining model name it should be singular and capitalised so a non pullerised non capitalised collection is created