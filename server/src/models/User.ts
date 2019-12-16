import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('User', UsersSchema);
