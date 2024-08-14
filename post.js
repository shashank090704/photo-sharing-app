var mongoose = require('mongoose');
//Set up default mongoose connection


mongoose.connect('mongodb://127.0.0.1/ptud');


const postmodel = mongoose.Schema({
     desc : String,
     userid: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
     },
     image : String

});
module.exports = mongoose.model("post", postmodel);