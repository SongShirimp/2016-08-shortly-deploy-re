var mongoose = require('mongoose');
var schema = require('../mongo_config.js');
var bcrypt = require('bcrypt-nodejs');

schema.user.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

schema.user.methods.comparePassword = function(candidatePassword, cb) {
    console.log('this password: ', this.password);
    console.log('candidate password: ', candidatePassword);
    console.log(this.password === candidatePassword);
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        console.log('isMatch ', isMatch);
        cb(null, isMatch);
    });
};


var User = mongoose.model('User', schema.user);

module.exports = User;
