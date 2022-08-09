const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        require : true,
    },
    password : {
        type : String,
        require : true,
        min : 4
    }
})

module.exports = mongoose.model("User", UserSchema)