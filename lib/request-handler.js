var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

// var db = require('../app/config');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

var mongodb = require('../app/mongo_config');
var User = require('../app/models/mongo_user');
var Link = require('../app/models/mongo_link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
  Link.find({}, function(err, links){
    if(err) return err;
    console.log('links :', links);
    res.send(200, links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });

  Link.findOne({ url: uri}, function(err, link){
    if(link) res.send(200, link);
    else util.getUrlTitle(uri, function(err, title) {
      if(err) {
        console.log('Error reading URL heading: ',err);
        return res.send(404);
      }
      console.log(title);
      var newLink = new Link({
        url: uri,
        title: title,
        baseUrl: req.headers.origin
      })
      newLink.save(function(err){
        if(err) return err;
        res.send(200, newLink);
      })
    })
  })
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });

  User.findOne({ username: username }, function(err, user){
    if(!user) res.redirect('/login');
    else user.comparePassword(password,function(err, isMatch){
      if(err) return err;
      else if(isMatch) {
        console.log('matching user!')
        util.createSession(req, res, user);
      }
      else {
        console.log('no matching user!')
        res.redirect('/login');
      }
    })
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });

  var newUser = new User({
    username: username,
    password: password
  });

  newUser.save(function(err){
    console.log('save')
    if(err) return err;
    else console.log('new user saved!');
    res.redirect('/login');
  })
};

exports.navToLink = function(req, res) {
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });

  Link.findOneAndUpdate({ code : req.params[0] }, {$inc:{ visits : 1}}, {new: true}, function(err, link){
    if(err) return err;
    if(!link) res.redirect('/');
    else {
      // console.log('link is: ',link);
      res.redirect(link.url);
    }
  })
};
