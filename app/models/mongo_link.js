var mongoose = require('mongoose');
var schema = require('../mongo_config.js');
var crypto = require('crypto');

schema.url.pre('save', function(next) {
    var link = this;

    // only hash the password if it has been modified (or is new)
    if (!link.isModified('url')) return next();
    var shasum = crypto.createHash('sha1');
    shasum.update(link.url);
    link.code = shasum.digest('hex').slice(0,5);
    next();
});


var Link = mongoose.model('Link', schema.url);


module.exports = Link;
