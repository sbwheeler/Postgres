'use strict';
const express = require('express');
const router = express.Router();
const tweetBank = require('../tweetBank');
const client = require('../db');




module.exports = io => {

  // a reusable function
  const respondWithAllTweets = (req, res, next) => {
    client.query('SELECT name, content, pictureurl, tweets.id FROM tweets INNER JOIN users on tweets.userid=users.id', function (err, result) {
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
    client.query('SELECT name, content, pictureurl FROM tweets INNER JOIN users on tweets.userid=users.id AND users.name=$1',[name], function (err, result) {
    if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
      });
  });

  // single-tweet page
  router.get('/tweets/:id', (req, res, next) => {
    const tweet = req.params.id;
    client.query('SELECT name, content, pictureurl FROM tweets INNER JOIN users on tweets.userid=users.id AND tweets.id=$1', [tweet], function (err,result) {
      if (err) return next(err);
      let tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // create a new tweet
  router.post('/tweets', (req, res, next) => {
    var username = req.body.name;
    var content = req.body.text;
    var tempid;

    client.query('SELECT * FROM users WHERE users.name=$1', [username], function (err, result) {
    if (result.rowCount === 0) {
      client.query('INSERT INTO users (name) VALUES ($1)', [username]);
      let temp = client.query('SELECT id, name FROM users WHERE users.name =$1', [username]);
      temp.on('row', function(row) {
        tempid = row.id;
        console.log(tempid);
        client.query('INSERT INTO tweets (userid, content) VALUES ($1, $2)', [tempid, content.toString()]);
        res.redirect('/');
      });
    } else {

    }
    });
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', => (req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
