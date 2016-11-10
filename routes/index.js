'use strict';
const express = require('express');
const router = express.Router();
const tweetBank = require('../tweetBank');
const client = require('../db');




module.exports = io => {

  // a reusable function
  const respondWithAllTweets = (req, res, next) => {
    client.query('SELECT name, content FROM tweets INNER JOIN users on tweets.userid=users.id', function (err, result) {
    if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
      });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);


  
  // single-user page
  router.get('/users/:username', (req, res, next) => {
    var name = req.params.username;
    client.query('SELECT name, content FROM tweets INNER JOIN users on tweets.userid=users.id AND users.name=$1',[name], function (err, result) {
    if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
      });
  });

  // single-tweet page
  router.get('/tweets/:id', (req, res, next) => {
    const tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsWithThatId // an array of only one element ;-)
    });
  });

  // create a new tweet
  router.post('/tweets', (req, res, next) => {
    const newTweet = tweetBank.add(req.body.name, req.body.text);
    io.sockets.emit('new_tweet', newTweet);
    res.redirect('/');
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', => (req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
