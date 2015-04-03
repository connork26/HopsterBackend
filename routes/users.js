var express = require('express');
var router = express.Router();
var db = require('../models/dataModel.js');
var helpers = require('../helpers.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', helpers.checkGetParams(['email', 'password']), function (req, res, next){
  db.checkForUser(req.query.email, req.query.password,
      function (err, result){
        if (result){
          res.send(JSON.stringify(result));
        } else {
          res.send('invalid login');
        }
      }
  )
});




module.exports = router;
