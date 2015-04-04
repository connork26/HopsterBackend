var express = require('express');
var router = express.Router();
var db = require('../models/dataModel.js');
var helpers = require('../helpers.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', helpers.checkGetParams(['email', 'password']), function (req, res, next){
    checkForUser(req.query.email, req.query.password,
        function (result){
            if (result){
                res.send(JSON.stringify(result));
            } else {
                res.send(JSON.stringify({
                    error: "login error",
                    message: "user doesn't exist"
                }));
            }
        }
    );
});

router.post('/createUser', helpers.checkPostParams(['fName', 'lName', 'email', 'password', 'zipcode']),
    function(req, res, next){
        checkForUserWithEmail(req.body.email,
            function (result){
                if (result){
                    res.send(JSON.stringify({
                        error: 'user error',
                        user: 'email already exsists'
                    }));
                } else {
                    db.createUser(req.body.fName, req.body.lName, req.body.password, req.body.email, req.body.zipcode,
                        function (err, result){
                            if (err){
                                console.log(err);
                                res.send(err);
                            } else {
                                checkForUser(req.body.email, req.body.password,
                                    function(user) {
                                        res.send(JSON.stringify(user));
                                    }
                                );
                            }
                        }
                    )
                }
            }
        );
    }
);

function checkForUser (email, password, next){
    db.checkForUser(email, password,
        function (err, result){
            if (err){
                return next(null);
            } else {
                return next(result);
            }
        }
    );
}

function checkForUserWithEmail (email, next){
    db.checkForUserWithEmail(email,
        function (err, results){
            if (results){
                return next(true);
            } else {
                return next(false);
            }
        }
    );
}



module.exports = router;
