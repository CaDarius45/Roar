const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: {type: String, required: true},
    age: Number,
    Pronouns: String,
    info: String,
    picture: String
  })

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    account: profileSchema
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);