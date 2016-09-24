var mongoose = require('mongoose');
var schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

var userSchema = new schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  time: { type: Date, default: Date.now }
});

var urlSchema = new schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 },
  time: { type: Date, default: Date.now }
});


module.exports = {
  user: userSchema,
  url: urlSchema
}
