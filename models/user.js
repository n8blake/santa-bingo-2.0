const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    //password: { type: String },
    displayName: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    created: { type: Date, required: true, default: new Date() },
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