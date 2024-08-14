
var mongoose = require('mongoose');
//Set up default mongoose connection
const plm = require("passport-local-mongoose")

mongoose.connect('mongodb://127.0.0.1/ptud');


const userModel = mongoose.Schema({
     name: String,
     username : String,
     password : String,
     posts : [{
           type : mongoose.Schema.Types.ObjectId,
           ref : 'post'
     }],
     dp : String,
     

});
userModel.plugin(plm);
module.exports = mongoose.model("user", userModel);