const mongoose = require('./db');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
