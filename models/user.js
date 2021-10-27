const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { v4: uuidv4 } = require('uuid');


const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    color: { type: String, default: 'red'},
    //password: { type: String },
    displayName: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    created: { type: Date, required: true, default: new Date() },
    uuid: { type: String, required: true, default: uuidv4, index: { unique: true }},
});

// UserSchema.pre("save", function(next){
//     if(!this.isModified("password")) return next();
//     bcrypt.hash(this.password, 16.5, (err, hash) => {
//         if(err) {
//             next(err);
//             return;
//         }
//         this.password = hash;
//         next();
//     })
// });

const User = Model("User", UserSchema);

module.exports = User;