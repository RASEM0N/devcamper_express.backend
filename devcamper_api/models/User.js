const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const colors = require('colors');
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: [true, 'Please use an unique email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please use a valid email',
        ],
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        require: [true, 'Please add a password'],
        minlenght: 6,
        /* не показывает пароль при запросе*/
        select: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    /* делаем шоб не срабатывало лишний раз при save*/
    if (!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Sign JWT and return
/* также доступно кто вызывает User.find... или шо-то другое User.запрос */
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    /* у нас есть this.password ибо .select('+password') */
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
/* Когда отправляем запрос у нас 
 * генерируется token и на него дается 10 мин */
UserSchema.methods.getResetPasswordToken = function(){
    // Generate token
    /* 20 байтов в параметре */
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set expire
    /* 10 минут и больше не рабочий */
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}
/* Модуль User */
module.exports = mongoose.model('User', UserSchema);
